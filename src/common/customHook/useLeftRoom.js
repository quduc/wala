import React, { useRef } from 'react';
import { AppState } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';
import * as screenTypes from '@navigation/screenTypes';
import { leftRoomSocket, sendMessageSocket } from '@modules/room/socket';
import { useSelector } from 'react-redux';
import { getRoomDetailSelector } from '@modules/room/selectors';
import { SocketIoSelector } from '@modules/home/selectors';
import { LIST_TAB, MESSAGES_TYPE } from '@common/constant';
import { resetMusic } from '@utils/TrackPlayerHelper';

import { useFocusEffect } from '@react-navigation/native';

export default function useLeftRoom() {
  const navigation = useNavigation();

  const router = useRoute();

  const room = useSelector(getRoomDetailSelector);
  const socketIo = useSelector(SocketIoSelector);
  const appState = useRef(AppState.currentState);

  useFocusEffect(
    React.useCallback(() => {
      AppState.addEventListener('change', _handleAppStateChange);
      return () => {
        AppState.removeEventListener('change', _handleAppStateChange);
        // event khi app đang ở foreground bà back ra va khi out room khi bi kick
        appState.current !== 'background' && resetRoom();
      };
    }, []),
  );

  const _handleAppStateChange = nextAppState => {
    appState.current = nextAppState;
    if (appState.current === 'background') {
      console.log('background');
      resetRoom();
      goToScreen('back');
    }
  };

  const resetRoom = () => {
    console.log('left rooommmmm');
    sendMessageSocket(socketIo, {
      roomId: router.params?.roomDetail.id,
      content: MESSAGES_TYPE.left_room,
    });
    resetMusic();
    // leftRoomSocket(socketIo, router.params?.roomDetail.id);
  };

  const goToScreen = screen => {
    if (screen === 'back') {
      navigation.navigate(screenTypes.HomeStack, {
        params: {
          tabName: LIST_TAB[1].title,
        },
      });
    } else {
      navigation.navigate(screenTypes.RoomDetailStack, {
        screen,
        params: { room },
      });
    }
  };
}
