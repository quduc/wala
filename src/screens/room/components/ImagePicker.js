/* eslint-disable react/jsx-wrap-multilines */
import React, { useState } from 'react';
import { Block, Text, Icon, Touchable, Loading } from '@components/index';
import { StyleSheet, ImageBackground } from 'react-native';

import colors from '@assets/colors';
import SvgComponent from '@assets/svg';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import { preUploadFile } from '@modules/uploadFile/slice';
import RNFetchBlob from 'rn-fetch-blob';
import { useModal } from '@common/customHook';
import { moderateScale, verticalScale } from '@common/scale';
import Toast from 'react-native-toast-message';

const options = {
  quality: 1.0,
  mediaType: 'photo',
};

const ImagePicker = ({ uriImage, setUriImage, ignore }) => {
  const { t } = useTranslation(['room', 'comom', 'message']);
  const [loading, setLoading] = useState(false);
  const [modal, contextHolder] = useModal();
  const dispatch = useDispatch();
  const onUpdateloadImage = () => {
    launchImageLibrary(options, resImage => {
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
                  // setUriImage(s3Url[0]);
                  setUriImage(`${resImage.uri}|AND|${s3Url[0]}`);
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

  const showErrorMessageImage = message => {
    modal.error({
      title: t('common:title_error'),
      content: message,
    });
  };

  const notify = () => {
    Toast.show({
      type: 'success',
      props: {
        message: 'Coming soon!!!!!',
        onClose: () => Toast.hide(),
      },
    });
  };

  return (
    <Touchable
      mt={16}
      onPress={ignore ? notify : onUpdateloadImage}
      disabled={!!loading}>
      <ImageBackground
        resizeMode='cover'
        source={{ uri: uriImage || null }}
        style={styles.imageBackground}
        imageStyle={styles.image}>
        <Block middle>
          {loading ? <Loading /> : <Icon xml={SvgComponent.image} />}

          <Text medium mt={14}>
            {uriImage ? t('txt_edit_image') : t('txt_add_image')}
          </Text>
        </Block>
      </ImageBackground>
      {contextHolder}
    </Touchable>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(32),
    backgroundColor: colors.gray,
    borderRadius: moderateScale(10),
  },
  image: {
    borderRadius: moderateScale(10),
    opacity: 0.5,
  },
});

export default ImagePicker;
