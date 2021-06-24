/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-undef */
import React, { memo, useEffect } from "react";
import { FlatList, RefreshControl } from "react-native";
import { Block, Body, RoomListItem, Loading } from "@components/index";
import { useDispatch, useSelector } from "react-redux";
import { fetchRooms, loadmoreRooms } from "@modules/room/slice";

import {
  fetchRoomsLoadingSelector,
  roomsSelector,
  loadmoreRoomsLoadingSelector,
  loadMoreRoomsNoMoreSelector,
} from "@modules/room/selectors";
import { BANNER_ID, LIMIT_ROOM } from "@common/constant";
import colors from "@assets/colors";

const TabRoom = () => {
  const dispatch = useDispatch();
  const rooms = useSelector(roomsSelector);
  const fetchRoomsLoading = useSelector(fetchRoomsLoadingSelector);
  const loadmoreRoomsLoading = useSelector(loadmoreRoomsLoadingSelector);
  const loadMoreRoomsNoMore = useSelector(loadMoreRoomsNoMoreSelector);

  useEffect(() => {
    onFetchRooms();
  }, []);

  const onFetchRooms = () => {
    dispatch(
      fetchRooms({
        params: {
          keyword: "",
        },
      })
    );
  };

  const onLoadMoreRoom = () => {
    dispatch(
      loadmoreRooms({
        params: {
          keyword: "",
        },
      })
    );
  };

  const _renderHeader = () => {
    const list = [...rooms];
    return (
      <Block mt={6}>
        {list.splice(0, 2).map((item) => (
          <RoomListItem item={item} key={item.id} />
        ))}
      </Block>
    );
  };

  return (
    <Body pr={16}>
      <FlatList
        data={[...rooms].splice(2)}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={_renderHeader}
        renderItem={({ item }) => <RoomListItem item={item} />}
        refreshControl={
          <RefreshControl
            refreshing={rooms.length === 0 && fetchRoomsLoading}
            onRefresh={onFetchRooms}
            tintColor={colors.white}
          />
        }
        onEndReached={() => {
          if (
            !loadMoreRoomsNoMore &&
            !loadmoreRoomsLoading &&
            rooms.length >= LIMIT_ROOM
          ) {
            onLoadMoreRoom();
          }
        }}
        onEndReachedThreshold={0.3}
        ListFooterComponent={() =>
          loadmoreRoomsLoading && (
            <Block center mv={10}>
              <Loading />
            </Block>
          )
        }
      />
    </Body>
  );
};

export default memo(TabRoom);
