/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect } from 'react';
import { Body, Block, Loading } from '@components/index';

import Header from '@components/header';
import { FlatList, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  fetchTotalUnReadNotification,
  loadmoreNotifications,
} from '@modules/notification/slice';
import {
  fetchNotificationsLoadingSelector,
  loadmoreNotificationsLoadingSelector,
  notificationsSelector,
} from '@modules/notification/selectors';
import {
  acceptInviteRoomLoadingSelector,
  loadMoreRoomsNoMoreSelector,
} from '@modules/room/selectors';
import colors from '@assets/colors';
import NotificationItem from './components/notificationItem';

const Notification = () => {
  const notificatiions = useSelector(notificationsSelector);
  const fetchNotificationsLoading = useSelector(
    fetchNotificationsLoadingSelector,
  );
  const loadmoreNotificationsLoading = useSelector(
    loadmoreNotificationsLoadingSelector,
  );
  const loadMoreRoomsNoMore = useSelector(loadMoreRoomsNoMoreSelector);
  const acceptInviteRoomLoading = useSelector(acceptInviteRoomLoadingSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    onFetchNotification();
  }, []);

  const onFetchNotification = () => {
    dispatch(fetchTotalUnReadNotification());
    dispatch(fetchNotifications());
  };

  const onLoadMoreNotification = () => {
    dispatch(loadmoreNotifications());
  };

  return (
    <Body loading={acceptInviteRoomLoading}>
      <Header title='Notification' isBack={false} />
      <Block mt={15} />

      <FlatList
        data={notificatiions}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={fetchNotificationsLoading}
            onRefresh={onFetchNotification}
            tintColor={colors.white}
          />
        }
        renderItem={({ item }) => (
          <NotificationItem item={item} key={item.id} />
        )}
        onEndReached={() => {
          if (
            !loadMoreRoomsNoMore &&
            !loadmoreNotificationsLoading &&
            notificatiions.length >= 10
          ) {
            onLoadMoreNotification();
          }
        }}
        onEndReachedThreshold={0.3}
        loadmoreLoading={() =>
          loadmoreNotificationsLoading && (
            <Block center mv={10}>
              <Loading />
            </Block>
          )
        }
      />
    </Body>
  );
};

export default Notification;
