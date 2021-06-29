/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-return-assign */
import React, { useState, useEffect, useRef } from "react";
import { FlatList, ImageBackground } from "react-native";
import Header from "@components/header";
import { Block, Body, Text, Image } from "@components/index";
import { useNavigation, useRoute } from "@react-navigation/core";
import images from "@assets/images";
import { useTranslation } from "react-i18next";
import SongItem from "@components/songItem";
import SearchView from "@components/search";
import { scale } from "@common/scale";
import { useDispatch, useSelector } from "react-redux";
import {
  getRoomDetailLoadingSelector,
  getRoomDetailSelector,
} from "@modules/chat/selectors";
import { useModal } from "@common/customHook";
import { getRoomDetail } from "@modules/chat/slice";
import { profileSelector } from "@modules/user/selectors";

export default function ListSongInRoom() {
  const router = useRoute();
  const { room } = router.params;
  const dispatch = useDispatch();
  const profile = useSelector(profileSelector);
  const loading = useSelector(getRoomDetailLoadingSelector);
  const roomDetail = useSelector(getRoomDetailSelector);
  const [listSongSearch, setListSongSearch] = useState([]);
  const [listSong, setListSong] = useState([]);
  const [modal, contextHolder] = useModal();
  const flatListRef = useRef();
  const navigation = useNavigation();
  const { t } = useTranslation(["room"]);
  const isHost = profile.id === room?.hostId;

  useEffect(() => {
    dispatch(
      getRoomDetail({
        data: {
          roomId: room.id,
        },
        onSuccess: (res) => {
          setListSongSearch(res.data.allSong);
          setListSong(res.data.allSong);
        },
        onError: (e) => {
          modal.error({
            title: t("common:title_error"),
            content: e.errorMessage,
          });
        },
      })
    );
  }, []);

  useEffect(() => {
    // set lai list khi favourite
    if (listSongSearch.length) {
      setListSongSearch(roomDetail.allSong);
      setListSong(roomDetail.allSong);
    }
  }, [roomDetail]);

  useEffect(() => {
    if (listSong.length !== 0 && room.nowPlaying) {
      const indexPlayingInAllSong = listSong.findIndex(
        (item) => item.id === room.nowPlaying.id
      );
      indexPlayingInAllSong > 1 &&
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            animated: true,
            index: indexPlayingInAllSong,
          });
        }, 300);
    }
  }, [listSong]);

  const goBackScreen = () => {
    navigation.goBack();
  };

  const _onChangeText = (value) => {
    const newList = listSong.filter((item) =>
      item?.song?.title
        .toLocaleLowerCase()
        .includes(value.toLocaleLowerCase().trim())
    );
    setListSongSearch(newList);
  };

  return (
    <Body loading={loading}>
      <ImageBackground
        source={room?.cover ? { uri: room?.cover } : images.room_default}
        style={{
          paddingHorizontal: scale(16),
        }}
        imageStyle={{ borderRadius: 10, opacity: 0.5 }}
      >
        <Header
          roomName={room.name}
          roomCode={` (${room.code})`}
          onLeftPress={goBackScreen}
        />
        <Block row mb={16}>
          <Image
            circle={32}
            defaultImage={images.default_avatar}
            uri={room?.host?.avatar}
          />
          <Block flex={1} ml={16}>
            <Text medium c1>
              {t("room:hostBy", {
                hostName: isHost ? t("room:you") : room?.host?.name,
              })}
            </Text>
            <Text medium c1 mt={4} numberOfLines={2}>
              {room.description}
            </Text>
          </Block>
        </Block>
      </ImageBackground>

      <SearchView
        placeholder="Search"
        m={16}
        onChangeText={_onChangeText}
        maxLength={254}
      />

      <FlatList
        ref={(ref) => (flatListRef.current = ref)}
        onScrollToIndexFailed={() => {}}
        showsVerticalScrollIndicator={false}
        style={{ marginHorizontal: 16 }}
        data={listSongSearch}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <SongItem item={item} room={room} nowPlaying={room.nowPlaying} />
        )}
        ListEmptyComponent={
          <Text medium center mt={16}>
            No Data
          </Text>
        }
      />
      {contextHolder}
    </Body>
  );
}
