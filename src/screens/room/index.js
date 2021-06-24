/* eslint-disable operator-linebreak */
/* eslint-disable no-useless-escape */
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
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import i18next from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  addListeners,
  createRoom,
  inviteFriendJoinRoom,
} from '@modules/room/slice';
import {
  listenersSelector,
  createRoomLoadingSelector,
} from '@modules/room/selectors';
import { TARGET_MEMBER, RULE_OF_ROOM } from '@common/constant';
import * as screenTypes from '@navigation/screenTypes';
import { JoinRoomSocket } from '@modules/room/socket';
import { SocketIoSelector } from '@modules/home/selectors';
import Toast from 'react-native-toast-message';
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
  if (!values.maxMember.trim().replace(/(\D)/g, '').replace(/^(0*)/, '')) {
    errors.maxMember = i18next.t('message:MSG_2', {
      field: i18next.t('common:maxMember'),
    });
  }

  return errors;
};

const CreateRoomModal = () => {
  const navigation = useNavigation();
  const { t } = useTranslation(['room', 'comom']);
  const [uriImage, setUriImage] = useState('');
  const [targetMember, setTargetMember] = useState(TARGET_MEMBER[0].value);
  const [rule, setRule] = useState(RULE_OF_ROOM[0].value);
  const dispatch = useDispatch();
  const listeners = useSelector(listenersSelector);
  const createRoomLoading = useSelector(createRoomLoadingSelector);
  const socketIo = useSelector(SocketIoSelector);

  const formik = useFormik({
    initialValues: { roomName: '', aboutRoom: '', maxMember: '10' },
    validate,
  });

  useEffect(() => () => onResetData(), []);

  const onGoBack = () => {
    navigation.goBack();
  };

  const onCreateRoom = () => {
    const { roomName, aboutRoom, maxMember } = formik.values;

    const listenerIds = listeners.map(item => item.id);
    dispatch(
      createRoom({
        data: {
          roomName,
          aboutRoom,
          maxMember: +maxMember,
          listenerIds,
          cover: uriImage.split('|AND|')[1],
          targetMember,
          skipRule: rule,
        },
        onSuccess: response => {
          if (response?.data && targetMember === TARGET_MEMBER[1].value) {
            onInviteFriendJoinRoom(response?.data || {});
          }
          onResetData();
          JoinRoomSocket(socketIo, response?.data?.id);
          navigation.navigate(screenTypes.RoomDetailStack, {
            screen: screenTypes.RoomDetail,
            params: {
              roomDetail: response?.data,
            },
          });
        },
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

  const onInviteFriendJoinRoom = room => {
    const userIds = listeners.map(item => item.id);
    dispatch(
      inviteFriendJoinRoom({
        data: {
          roomId: room?.id,
          userIds,
        },
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

  const onResetData = () => {
    formik.resetForm();
    setTargetMember(TARGET_MEMBER[0].value);
    setRule(RULE_OF_ROOM[0].value);
    setUriImage('');
    dispatch(
      addListeners({
        listeners: [],
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
    <Body
      hideMiniMusicPlayer
      scroll
      bg='transparent'
      loading={createRoomLoading}>
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
            {t('room:txt_create_new_room')}
          </Text>
          <Touchable onPress={onGoBack}>
            <Text medium c1 color={colors.orange} left>
              {t('txt_btn_cancel')}
            </Text>
          </Touchable>
        </Block>

        <Block>
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
          <ImagePicker
            uriImage={uriImage.split('|AND|')[0]}
            setUriImage={setUriImage}
          />
          <Text mt={18} gradient medium>
            {t('text_who_can_join')}
          </Text>
          <ModalSelectOption
            items={TARGET_MEMBER}
            value={targetMember}
            setValue={setTargetMember}
          />
          <Text mt={18} gradient medium>
            {t('max_user')}
          </Text>

          <MaxMemberInput formik={formik} />

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
            onPress={onCreateRoom}>
            <Text medium c1 color={colors.white}>
              {t('txt_create')}
            </Text>
          </Button>
        </Block>
      </Block>
    </Body>
  );
};

export default CreateRoomModal;
