import { createSelector } from 'reselect';

const roomSelector = state => state.room;

export const suggestSongLoadingSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.suggestSongLoading,
);

export const getRoomDetailLoadingSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.getRoomDetailLoading,
);

export const getRoomDetailSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.getRoomDetail,
);

export const createRoomLoadingSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.createRoomLoading,
);
export const createRoomErrorSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.createRoomError,
);

export const searchSongYoutubeLoadingSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.searchSongYoutubeLoading,
);
export const searchSongYoutubeErrorSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.searchSongYoutubeLoadingError,
);

export const listenersSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.listeners,
);

export const roomsSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.rooms,
);

export const fetchRoomsLoadingSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.fetchRoomsLoading,
);

export const fetchRoomsErrorSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.fetchRoomsError,
);

export const roomsOffsetSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.roomsOffset,
);

export const loadmoreRoomsLoadingSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.loadmoreRoomsLoading,
);

export const loadmoreRoomsErrorSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.loadmoreRoomsError,
);

export const loadMoreRoomsNoMoreSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.loadMoreRoomsNoMore,
);

export const userJoinRoomLoadingSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.userJoinRoomLoading,
);

export const userJoinRoomSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.userJoinRoom,
);

export const sendMessageLoadingSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.sendMessageLoading,
);

export const sendMessageErrorSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.sendMessageError,
);

export const messageListSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.messageList,
);
export const fetchMessageListLoadingSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.fetchMessageListLoading,
);
export const fetchMessageListErrorSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.fetchMessageListError,
);

export const messageLastIdSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.messageLastId,
);
export const loadMoreMessageListNoMoreSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.loadMoremessageListNoMore,
);
export const loadmoreMessageListLoadingSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.loadmoremessageListLoading,
);
export const loadmoremessageListErrorSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.loadmoremessageListError,
);

export const acceptInviteRoomLoadingSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.acceptInviteRoomLoading,
);
export const acceptInviteRoomErrorSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.acceptInviteRoomError,
);

export const inviteFriendJoinRoomLoadingSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.inviteFriendJoinRoomLoading,
);
export const inviteFriendJoinRoomErrorSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.inviteFriendJoinRoomError,
);

export const inviteListSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.inviteList,
);
export const fetchInviteListLoadingSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.fetchInviteListLoading,
);
export const fetchInviteListErrorSelector = createSelector(
  roomSelector,
  roomReducer => roomReducer.fetchInviteListError,
);
