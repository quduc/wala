/* eslint-disable react/jsx-wrap-multilines */
import React, { useState, useEffect } from 'react';
import {
  Body,
  Block,
  Text,
  Touchable,
  TextInput,
  Button,
} from '@components/index';

import colors from '@assets/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import i18next from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateRoom } from '@modules/room/slice';
import { useModal } from '@common/customHook';
import * as screenTypes from '@navigation/screenTypes';
import { createRoomLoadingSelector } from '@modules/room/selectors';
import { TARGET_MEMBER, RULE_OF_ROOM } from '@common/constant';
import ModalSelectOption from './components/ModalSelectOption';
import ImagePicker from './components/ImagePicker';
import MaxMemberInput from './components/MaxMemberInput';

const validate = values => {
  const errors = {};

  if (!values.roomName.trim()) {
    errors.roomName = i18next.t('message:MSG_2', {
      field: i18next.t('common:roomName'),
    });
  }

  if (!values.maxMember.trim() || values.maxMember === '0') {
    errors.maxMember = i18next.t('message:MSG_2', {
      field: i18next.t('common:maxMember'),
    });
  }

  return errors;
};

const UpdateRoom = () => {
  const navigation = useNavigation();
  const { t } = useTranslation(['room', 'comom']);
  const [uriImage, setUriImage] = useState('');
  const [targetMember, setTargetMember] = useState(TARGET_MEMBER[0].value);
  const [rule, setRule] = useState(RULE_OF_ROOM[0].value);
  const [modal, contextHolder] = useModal();
  const dispatch = useDispatch();
  const createRoomLoading = useSelector(createRoomLoadingSelector);
  const route = useRoute();

  const formik = useFormik({
    initialValues: { roomName: '', aboutRoom: '', maxMember: '10' },
    validate,
  });

  useEffect(() => {
    const roomDetail = route.params?.roomDetail;
    formik.setValues({
      roomName: roomDetail.name,
      aboutRoom: roomDetail.description,
      maxMember: `${roomDetail?.number}`,
    });
    setTargetMember(roomDetail.type);
    setRule(roomDetail.skipRule);
    setUriImage(roomDetail.cover);
  }, [route.params?.fromScreen]);

  const onGoBack = () => {
    navigation.goBack();
  };

  const onUpdateRoom = () => {
    const { roomName, aboutRoom, maxMember } = formik.values;

    dispatch(
      updateRoom({
        data: {
          roomId: route.params?.roomDetail?.id,
          roomName,
          aboutRoom,
          maxMember: +maxMember,
          cover: uriImage,
          targetMember,
          skipRule: rule,
        },
        onSuccess: () => {
          navigation.goBack();
        },
        onError: e => {
          modal.error({
            title: t('common:title_error'),
            content: e.errorMessage,
          });
        },
      }),
    );
  };

  const handleTrimWhenBlurInput = (inputName, e) => {
    formik.setFieldValue(inputName, formik.values[inputName].trim());
    formik.handleBlur(inputName)(e);
  };

  const isDisableButton = () =>
    Object.keys(formik.errors).length !== 0 ||
    !formik.values.roomName ||
    !rule ||
    !targetMember;

  return (
    <Block flex={1} justifyEnd>
      <Touchable height={40} opacity={0} onPress={onGoBack} />
      <Block
        flex={1}
        ph={16}
        bg={colors.blackPrimary}
        borderTopRightRadius={20}
        borderTopLeftRadius={20}>
        <Block row mt={32} mb={24}>
          <Text medium c1 color={colors.blackPrimary} left>
            Cancel
          </Text>
          <Text bold h5 center flex={1}>
            {t('room:editRoom')}
          </Text>
          <Touchable onPress={onGoBack}>
            <Text medium c1 color={colors.orange} left>
              {t('txt_btn_cancel')}
            </Text>
          </Touchable>
        </Block>

        <Body bg='transparent' scroll keyboardAvoid loading={createRoomLoading}>
          <TextInput
            placeholder={t('placeholder_room_name')}
            maxLength={30}
            fontSize={12}
            iconRight={
              <Text medium c2 color={colors.textGrayDark}>
                {formik.values.roomName.length}
                /30
              </Text>
            }
            value={formik.values.roomName}
            onChangeText={formik.handleChange('roomName')}
            onBlur={e => handleTrimWhenBlurInput('roomName', e)}
            error={formik.errors.roomName && formik.touched.roomName}
            errorMessage={formik.errors.roomName}
          />
          <TextInput
            height={140}
            mt={18}
            multiline
            numberOfLines={10}
            fontSize={12}
            placeholder={t('placeholder_about_room')}
            maxLength={100}
            iconRight={
              <Block flex={1} justifyEnd ml={5}>
                <Text mb={15} medium c2 color={colors.textGrayDark}>
                  {formik.values.aboutRoom.length}
                  /100
                </Text>
              </Block>
            }
            value={formik.values.aboutRoom}
            onChangeText={formik.handleChange('aboutRoom')}
            onBlur={e => handleTrimWhenBlurInput('aboutRoom', e)}
            error={formik.errors.aboutRoom && formik.touched.aboutRoom}
            errorMessage={formik.errors.aboutRoom}
          />

          <ImagePicker uriImage={uriImage} setUriImage={setUriImage} ignore />

          <Text mt={18} gradient medium>
            {t('text_who_can_join')}
          </Text>

          <ModalSelectOption
            items={TARGET_MEMBER}
            value={targetMember}
            setValue={setTargetMember}
            ignoreAddListeners
          />

          <Text mt={18} gradient medium>
            {t('max_user')}
          </Text>

          <MaxMemberInput
            formik={formik}
            fromScreen={screenTypes.UpdateRoomScreen}
          />

          <Text mt={18} gradient medium>
            {t('txt_skip_rule')}
          </Text>

          <ModalSelectOption
            items={RULE_OF_ROOM}
            value={rule}
            setValue={setRule}
          />

          <Button
            height={40}
            gradient
            mt={18}
            mb={35}
            borderRadius={3}
            bg={colors.orange}
            disabled={isDisableButton()}
            onPress={onUpdateRoom}>
            <Text medium c1 color={colors.white}>
              {t('txt_done')}
            </Text>
          </Button>
        </Body>
      </Block>

      {contextHolder}
    </Block>
  );
};

export default UpdateRoom;
