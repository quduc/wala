import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '@components/header';
import {
  KeyboardAvoidingView,
  AppState,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import SvgComponent from '@assets/svg';
import {
  Block,
  Image,
  Body,
  Text,
  Icon,
  Button,
  Touchable,
} from '@components/index';
import { useNavigation, useRoute } from '@react-navigation/core';
import images from '@assets/images';
import * as screenTypes from '@navigation/screenTypes';
import { useTranslation } from 'react-i18next';
import {
  fetchMessageList,
  fetchRooms,
  getRoomDetailSucceeded,
} from '@modules/room/slice';
import {
  subUpdateRoomInfoSocket,
  unSubUpdateRoomInfoSocket,
  leftRoomSocket,
  sendMessageSocket,
  subForceLeaveSocket,
  unSubForceLeaveSocket,
  changeRoomModeSocket,
  subNotificationSocket,
  unSubNotificationSocket,
} from '@modules/room/socket';
import { useDispatch, useSelector } from 'react-redux';
import {
  useModal,
  useShowChangeHost,
  useShowSocketError,
} from '@common/customHook';
import { getRoomDetailSelector } from '@modules/room/selectors';
import { profileSelector } from '@modules/user/selectors';
import Toast from 'react-native-toast-message';
import { SocketIoSelector } from '@modules/home/selectors';
import { LIST_TAB, MESSAGES_TYPE, ROOM_MODE } from '@common/constant';
import colors from '@assets/colors';
import { pauseMusic, resetMusic } from '@utils/TrackPlayerHelper';
import { useInterval } from '@common/customHook/index';
import ChangeRoomModeModal from '@screens/room/components/ChangeRoomModeModel';
import dayjs from 'dayjs';
import ChatModule from './components/ChatModules';
import ResultRound from './components/ResultRound';

const TOTAL_TIME = 60;
const type = {
  START_TOUR: 'START_TOURNAMENT',
  STOP_TOUR: 'STOP_TOURNAMENT',
  END_ROUND: 'END_ROUND',
};
const isIos = Platform.OS === 'ios';

export default function RoomDetail() {
  const [isShowChangeModeModal, setIsShowChangeModeModal] = useState(false);
  const [isShowResult, setIsShowResult] = useState(false);
  const [isSongSelected, setIsSongSelected] = useState(false);
  const [isNewTour, setIsNewTour] = useState(false);
  const [resultRound, setResultRound] = useState([]);
  const [countdownTime, setCoundownTime] = useState(TOTAL_TIME);
  const [continueCountdownTime, setContinueCoundownTime] = useState(0);
  const [timeNextTour, setTimeNextTour] = useState(5);
  const navigation = useNavigation();
  const { t } = useTranslation(['room', 'common', 'message']);
  const [modal, contextHolder] = useModal();
  const router = useRoute();

  const dispatch = useDispatch();
  const profile = useSelector(profileSelector);
  const room = useSelector(getRoomDetailSelector);
  const isHost = profile.id === room?.hostId;
  const isTour = room.mode === ROOM_MODE.TOUR;
  const socketIo = useSelector(SocketIoSelector);
  const appState = useRef(AppState.currentState);

  const handleTimeShowModal = useInterval(
    () => setCoundownTime(preTime => setCoundownTime(preTime - 1)),
    1000,
  );

  const handleTimeNextTour = useInterval(
    () => setTimeNextTour(preTime => setTimeNextTour(preTime - 1)),
    1000,
  );

  useShowChangeHost();
  useShowSocketError();
  useEffect(() => {
    dispatch(
      fetchMessageList({
        data: {
          roomId: router.params?.roomDetail.id,
        },
      }),
    );

    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
      // event khi app đang ở foreground bà back ra va khi out room khi bi kick
      appState.current !== 'background' && resetRoom();
    };
  }, []);

  useEffect(() => {
    subUpdateRoomInfoSocket(socketIo, res => {
      console.log('subUpdateRoomInfoSocket', res);
      dispatch(getRoomDetailSucceeded(res));
    });

    return () => {
      unSubUpdateRoomInfoSocket(socketIo);
    };
  }, []);

  useEffect(() => {
    if (isTour && !isHost) {
      const currentTime = dayjs(new Date());
      const curentMusicTime = dayjs(room.startTour);
      const secondDifference = currentTime.diff(curentMusicTime, 'second');
      if (secondDifference <= TOTAL_TIME) {
        setCoundownTime(TOTAL_TIME - secondDifference);
        // setTimeout(() => {
        setIsShowChangeModeModal(true);
        // }, 300);
        handleTimeShowModal.start();
      }
    }
  }, [room.mode]);

  useEffect(() => {
    subForceLeaveSocket(socketIo, () => {
      goToScreen('back');
      setTimeout(() => {
        Toast.show({
          type: 'error',
          props: {
            message: t('message:MSG_25'),
            onClose: () => Toast.hide(),
            visibilityTime: 3000,
          },
        });
      }, 300);
    });
    return () => {
      unSubForceLeaveSocket(socketIo);
    };
  }, []);

  useEffect(() => {
    subNotificationSocket(socketIo, res => {
      const { hostId } = res.data.extraInfo;
      const tourStatus = res.data.type;
      if (tourStatus === type.START_TOUR) {
        if (profile.id === hostId) {
          goToSuggestSongScreen();
        } else {
          setTimeout(() => {
            setIsShowChangeModeModal(true);
          }, 300);
          handleTimeShowModal.start();
        }
      } else if (tourStatus === type.END_ROUND) {
        setResultRound(res.data.extraInfo?.result);
        setIsShowResult(true);
        setIsSongSelected(false);
        setIsNewTour(true);
        setContinueCoundownTime(0);

        handleTimeNextTour.start();
      } else if (tourStatus === type.STOP_TOUR) {
        setContinueCoundownTime(0);
        setIsSongSelected(false);
      }
    });
    return () => {
      handleTimeShowModal.stop();
      handleTimeNextTour.stop();
      unSubNotificationSocket(socketIo);
    };
  }, []);

  // continueCountdownTime: khi user cick Skip thi tiep tuc hien thi countdown
  // router.params?.countdownTime: tu man hinh suggest song back lai
  useEffect(() => {
    if (router.params?.countdownTime || continueCountdownTime !== 0) {
      setCoundownTime(router.params?.countdownTime || continueCountdownTime);
      handleTimeShowModal.start();
    }
  }, [router.params?.countdownTime, continueCountdownTime]);

  useEffect(() => {
    console.log('vao day ko', router.params?.selectedItem);
    router.params?.selectedItem && setIsSongSelected(true);
  }, [router.params?.selectedItem]);
  // console.log('setIsSongSelected ', router.params?.selectedItem);

  useEffect(() => {
    countdownTime === 0 && resetModal();
  }, [countdownTime]);

  useEffect(() => {
    if (timeNextTour === 0) {
      handleTimeNextTour.stop();
      setTimeNextTour(5);
      setIsShowResult(false);
    }
  }, [timeNextTour]);

  const resetModal = () => {
    setIsShowChangeModeModal(false);
    setCoundownTime(TOTAL_TIME);
    handleTimeShowModal.stop();
  };

  const skipSelectSongInTour = () => {
    setIsShowChangeModeModal(false);
    // handleTimeShowModal.stop();
    setContinueCoundownTime(countdownTime);
  };

  const selectSong = () => {
    resetModal();
    navigation.navigate(screenTypes.RoomDetailStack, {
      screen: screenTypes.SuggestSong,
      params: { isTour, time: countdownTime },
    });
  };

  const goToSuggestSongScreen = () => {
    setCoundownTime(TOTAL_TIME);
    handleTimeShowModal.stop();
    goToScreen(screenTypes.SuggestSong, {
      isTour: true,
      time: countdownTime,
    });
  };

  const _handleAppStateChange = nextAppState => {
    appState.current = nextAppState;
    if (appState.current === 'background') {
      console.log('background');
      resetRoom();
      goToScreen('back');
    }
  };

  const resetCoundownTime = useCallback(() => {
    setCoundownTime(0);
  }, []);

  const resetRoom = () => {
    sendMessageSocket(socketIo, {
      roomId: router.params?.roomDetail.id,
      content: MESSAGES_TYPE.left_room,
    });
    resetMusic();
    leftRoomSocket(socketIo, router.params?.roomDetail.id);
  };

  const onFetchRooms = () => {
    dispatch(
      fetchRooms({
        params: {
          keyword: '',
        },
      }),
    );
  };

  const goToScreen = (
    screen,
    params = { room, fromScreen: ROOM_MODE.NORMAL },
  ) => {
    if (screen === 'back') {
      dispatch(getRoomDetailSucceeded({ data: {} }));
      onFetchRooms();
      navigation.navigate(screenTypes.HomeStack, {
        params: {
          tabName: LIST_TAB[1].title,
        },
      });
    } else {
      navigation.navigate(screenTypes.RoomDetailStack, {
        screen,
        params,
      });
    }
  };

  const goToCreateRoomScreen = () => {
    navigation.navigate(screenTypes.UpdateRoomScreen, {
      fromScreen: screenTypes.RoomDetail,
      roomDetail: room,
    });
  };
  const showStartTournamentModal = value => {
    modal.normal({
      title: t(
        value === type.START_TOUR
          ? 'txt_change_mode_title'
          : 'stopTournamentMode',
      ),
      content:
        value === type.START_TOUR ? (
          <Block>
            <Text c1 medium center color={colors.textGrayLight} mt={10}>
              {t('txt_change_mode_content_1')}
            </Text>
            <Text c1 bold center color={colors.textGrayLight}>
              {t('txt_change_mode_content_2')}{' '}
            </Text>
            <Text c1 medium center color={colors.textGrayLight} mt={10}>
              {t('txt_change_mode_content_3')}{' '}
            </Text>
          </Block>
        ) : (
          t('doYouWantToStopTour')
        ),
      okButton: () => {
        onStartAndSkipTournament();
      },
    });
  };

  const onStartAndSkipTournament = () => {
    changeRoomModeSocket(socketIo);
    pauseMusic();
    resetMusic();
  };

  return (
    <Body>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Block ph={16} flex={1}>
          <Header
            isBack={false}
            iconLeft={SvgComponent.close}
            onLeftPress={() => goToScreen('back')}
            roomName={room.name}
            roomCode={` (${room.code})`}
            nodeRight={
              isHost && (
                <Icon
                  touchable
                  onPress={goToCreateRoomScreen}
                  xml={SvgComponent.pencil}
                  ml={16}
                />
              )
            }
          />
          {(router.params?.countdownTime || continueCountdownTime !== 0) &&
            countdownTime !== TOTAL_TIME &&
            isTour && (
              <Text mv={16} c1 medium center>
                {t('tourWillStart')}{' '}
                <Text bold color={colors.orange}>
                  {countdownTime}s
                </Text>
              </Text>
            )}
          <Block row middle flx={1}>
            <Image
              circle={32}
              uri={room?.host?.avatar}
              defaultImage={images.default_avatar}
            />
            <Block flex={1}>
              <Text medium c1 gradient ml={8}>
                {t('hostBy', {
                  hostName: isHost ? t('you') : room?.host?.name,
                })}
              </Text>
            </Block>
            {isHost ? (
              <Button
                gradient={!isTour}
                bg={isTour ? colors.redPink : null}
                row
                middle
                pv={4}
                ph={8}
                borderRadius={20}
                onPress={() =>
                  showStartTournamentModal(
                    isTour ? type.END_ROUND : type.START_TOUR,
                  )
                }>
                <Icon xml={SvgComponent.tourMode} mr={8} />
                <Text medium c1>
                  {t(isTour ? 'txt_stop_tournament' : 'txt_start_tournament')}
                </Text>
              </Button>
            ) : (
              isTour && (
                <Block gradient row middle pv={4} ph={8} borderRadius={20}>
                  <Icon xml={SvgComponent.tourMode} mr={8} />
                  <Text medium c1>
                    {t('txt_tournament_mode')}
                  </Text>
                </Block>
              )
            )}
          </Block>
          {!isShowResult ? (
            <Block>
              <Block row middle mt={8} mb={16} justifyBetween ml={4}>
                <Block row middle>
                  <Icon
                    touchable
                    onPress={() => {}}
                    xml={SvgComponent.totalPeople}
                  />
                  <Text medium ml={8} mt={2}>
                    {room?.totalMember}
                  </Text>
                </Block>
                <Touchable
                  disabled={isTour && room?.round === 1}
                  opacity={isTour && room?.round === 1 ? 0.5 : 1}
                  row
                  middle
                  onPress={() => goToScreen(screenTypes.ListSongInRoom)}>
                  <Icon xml={SvgComponent.queueMusic} ml={32} />
                  <Text medium ml={8}>
                    {t('playlist')}
                  </Text>
                </Touchable>

                <Touchable
                  disabled={(!!isTour && countdownTime === 0) || isSongSelected}
                  opacity={
                    (isTour && countdownTime === 0) || isSongSelected ? 0.4 : 1
                  }
                  row
                  borderRadius={20}
                  ml={16}
                  onPress={selectSong}>
                  <Icon xml={SvgComponent.selectSong} />
                  <Text medium ml={10} numberOfLines={1}>
                    {t('room:selectSong')}
                  </Text>
                </Touchable>
              </Block>
              {contextHolder}
            </Block>
          ) : (
            <>
              <Text c1 medium center mt={16}>
                {t('room:nextRoundWill')}{' '}
                <Text bold color={colors.orange}>
                  {timeNextTour}s
                </Text>
              </Text>
              <ResultRound result={resultRound} />
            </>
          )}
        </Block>
      </TouchableWithoutFeedback>
      {!isShowResult && (
        <KeyboardAvoidingView behavior='padding'>
          <Block
            height={360}
            bg='#111315'
            pb={isIos ? 50 : 20}
            borderTopLeftRadius={20}
            borderTopRightRadius={20}>
            <ChatModule roomId={router.params?.roomDetail.id} />
          </Block>
        </KeyboardAvoidingView>
      )}

      <ChangeRoomModeModal
        visible={isShowChangeModeModal}
        onClose={() => setIsShowChangeModeModal(false)}
        countdown={countdownTime}
        skip={skipSelectSongInTour}
        selectSong={selectSong}
        isNewTour={isNewTour}
      />
    </Body>
  );
}
