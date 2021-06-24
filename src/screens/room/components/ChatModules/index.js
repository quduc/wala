/* eslint-disable react/jsx-wrap-multilines */
import React, { useState, useEffect } from 'react';
import { Block, Icon, Text, TextInput } from '@components/index';
import SvgComponent from '@assets/svg';
import { useDispatch, useSelector } from 'react-redux';
import { pushMessageToList } from '@modules/room/slice';
import { useModal } from '@common/customHook';
import { useTranslation } from 'react-i18next';
import { sendMessageLoadingSelector } from '@modules/room/selectors';
import {
  sendMessageSocket,
  subscribeGetMessageSocket,
  unSubscribeGetMessageSocket,
} from '@modules/room/socket';
import { SocketIoSelector } from '@modules/home/selectors';
import ListMessage from './ListMessage';

const ChatModule = ({ roomId }) => {
  const { t } = useTranslation(['auth', 'common']);
  const [messages, setMessage] = useState('');
  const [modal, contextHolder] = useModal();
  const sendMessageLoading = useSelector(sendMessageLoadingSelector);
  const socketIo = useSelector(SocketIoSelector);
  const dispatch = useDispatch('');

  useEffect(() => {
    subscribeGetMessageSocket(socketIo, res => {
      if (res?.data) {
        dispatch(
          pushMessageToList({
            message: res.data,
          }),
        );
      }
    });

    return () => unSubscribeGetMessageSocket(socketIo);
  }, []);

  const onSendMessage = () => {
    if (messages) {
      sendMessageSocket(socketIo, {
        roomId,
        content: messages,
      });
      setMessage('');
    }
  };

  return (
    <Block flex={1}>
      <Text c1 medium center mv={5}>
        Today, 4:20pm
      </Text>
      <Block flex={1}>
        <ListMessage roomId={roomId} />
      </Block>
      <TextInput
        mt={16}
        mh={16}
        placeholder='Aa'
        maxLength={300}
        height={40}
        autoCorrect={false}
        value={messages}
        onChangeText={value => setMessage(value)}
        iconRight={
          <Icon
            touchable
            xml={SvgComponent.sendIcon}
            onPress={onSendMessage}
            disabled={sendMessageLoading}
          />
        }
      />
      {contextHolder}
    </Block>
  );
};

export default ChatModule;
