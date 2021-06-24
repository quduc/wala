import React, { useState } from 'react';
import {
  Body,
  Block,
  Text,
  Image,
  Touchable,
  TextInput,
  Loading,
} from '@components/index';
import images from '@assets/images';
import colors from '@assets/colors';
import HeaderProfile from '../../components/header/HeaderProfile';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/core';
import * as screenTypes from '@navigation/screenTypes';
import ChoosePhotoModal from './components/ChoosePhotoModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  profileSelector,
  loadingUpdateProfileSelector,
} from '@modules/user/selectors';
import { useFormik } from 'formik';
import { isUserName } from '@utils/';
import i18next from 'i18next';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { preUploadFile } from '@modules/uploadFile/slice';
import { useModal } from '@common/customHook';
import { updateProfile } from '@modules/user/slice';
import Toast from 'react-native-toast-message';

const options = {
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const validate = values => {
  const errors = {};
  if (!isUserName(values.name.trim())) {
    errors.name = i18next.t('message:MSG_5');
  }
  return errors;
};

export default function EditProfile() {
  const [isShowModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const { navigate, goBack } = useNavigation();
  const dataProfile = useSelector(profileSelector);
  const [image, setImage] = useState(dataProfile.avatar);
  const [loading, setLoading] = useState(false);
  const [modal] = useModal();
  const loadingUpdate = useSelector(loadingUpdateProfileSelector);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: dataProfile?.name,
      email: dataProfile?.email,
      description: dataProfile?.description,
    },
    validate,
  });

  const showModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const goToChangePassword = () => {
    navigate(screenTypes.ProfileDetailStack, {
      screen: screenTypes.ChangePassword,
    });
  };

  const handleTrimWhenBlurInput = (inputName, e) => {
    formik.setFieldValue(inputName, formik.values[inputName].trim());
    formik.handleBlur(inputName)(e);
  };

  const onRemoveCurrentPhoto = () => {
    setImage(null);
  };

  const showErrorMessageImage = message => {
    modal.error({
      title: t('common:title_error'),
      content: message,
    });
  };

  const onChosenPhotoFromLibrary = cb => {
    launchImageLibrary(options, resImage => {
      cb && cb();
      const { fileSize } = resImage;
      const mg = fileSize / 1000000;
      if (mg > 10) {
        return showErrorMessageImage(t('message:MSG_37'));
      }

      if (resImage.uri) {
        setLoading(true);
        dispatch(
          preUploadFile({
            data: {
              type: 'COVER',
              name: resImage.fileName,
            },
            onSuccess: responseS3 => {
              RNFetchBlob.fetch(
                'PUT',
                responseS3.data.url,
                {
                  'Content-Type': 'octet-stream',
                },
                RNFetchBlob.wrap(resImage.uri.replace('file://', '')),
              )
                .then(() => {
                  const s3Url = responseS3.data.url.split('?');
                  setImage(s3Url[0]);
                  setLoading(false);
                })
                .catch(err => {
                  showErrorMessageImage(err.errorMessage);
                  setLoading(false);
                });
            },
            onError: error => {
              setLoading(false);
              showErrorMessageImage(error.errorMessage);
            },
          }),
        );
      }
    });
  };

  const onUpdateProfile = () => {
    if (
      image === dataProfile.avatar &&
      formik.values.name === dataProfile.name &&
      formik.values.description === dataProfile.description
    )
      return goBack();
    dispatch(
      updateProfile({
        data: {
          name: formik.values.name,
          avatar: image,
          description: formik.values.description,
        },
        onSuccess: () => goBack(),
        onError: e => {
          Toast.show({
            type: 'error',
            props: {
              message: e.errorMessage,
            },
          });
        },
      }),
    );
  };

  const renderImage = () => {
    if (loading) {
      return <Loading />;
    } else {
      return image ? (
        <Image source={{ uri: image }} circle={74} />
      ) : (
        <Image source={images.default_avatar} circle={74} />
      );
    }
  };

  return (
    <Body ph={16} loading={loadingUpdate} keyboardAvoid>
      <HeaderProfile title='editProfile' onPressRight={onUpdateProfile} />
      <Touchable middle mt={16} borderBottom pb={16} onPress={showModal}>
        {renderImage()}
        <Block>
          <Text medium c1 mt={16}>
            {t('changeProfilePhoto')}
          </Text>
        </Block>
      </Touchable>
      <Block mt={16} center>
        <Text c1 extraBold>
          {t('username')}
        </Text>
        <TextInput
          mt={8}
          color={colors.white}
          value={formik.values.name}
          onBlur={e => handleTrimWhenBlurInput('name', e)}
          onChangeText={formik.handleChange('name')}
          error={formik.errors.name}
          errorMessage={formik.errors.name}
        />
      </Block>
      <Block mt={16} center>
        <Text c1 extraBold>
          {t('bio')}
        </Text>
        <TextInput
          value={formik.values.description}
          onChangeText={formik.handleChange('description')}
          error={formik.errors.description}
          errorMessage={formik.errors.description}
          height={140}
          mt={18}
          multiline
          numberOfLines={10}
          fontSize={12}
          maxLength={300}
        />
      </Block>
      <Block mt={16} center borderBottom pb={16}>
        <Text c1 extraBold>
          {t('email')}
        </Text>
        <TextInput
          mt={8}
          color={colors.white}
          value={formik.values.email}
          editable={false}
        />
      </Block>
      <Touchable mt={16} borderBottom pb={16} onPress={goToChangePassword}>
        <Text color={colors.orange} extraBold c1>
          {t('changeYourPassword')}
        </Text>
      </Touchable>
      <ChoosePhotoModal
        visible={isShowModal}
        onClose={closeModal}
        onRemoveCurrentPhoto={onRemoveCurrentPhoto}
        onChosenPhotoFromLibrary={onChosenPhotoFromLibrary}
      />
    </Body>
  );
}
