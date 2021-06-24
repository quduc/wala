/* eslint-disable no-param-reassign */
import { LIMIT_ROOM } from '@common/constant';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  createRoomLoading: false,
  createRoomError: '',
  listeners: [],

  updateRoomLoading: false,
  updateRoomError: '',

  rooms: [],
  fetchRoomsLoading: false,
  fetchRoomsError: '',

  roomsOffset: 0,
  loadMoreRoomsNoMore: false,
  loadmoreRoomsLoading: false,
  loadmoreRoomsError: '',

  userJoinRoomLoading: false,
  userJoinRoomError: '',

  getRoomDetail: {},
  getRoomDetailLoading: false,
  suggestSongLoading: false,

  sendMessageLoading: false,
  sendMessageError: false,

  messageList: [],
  fetchMessageListLoading: false,
  fetchMessageListError: '',

  messageLastId: '',
  loadMoremessageListNoMore: false,
  loadmoremessageListLoading: false,
  loadmoremessageListError: '',

  inviteFriendJoinRoomLoading: false,
  inviteFriendJoinRoomError: '',

  acceptInviteRoomLoading: false,
  acceptInviteRoomError: '',

  inviteList: [],
  fetchInviteListLoading: false,
  fetchInviteListError: '',
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    suggestSong: state => {
      state.suggestSongLoading = true;
    },
    suggestSongSucceeded: (state, action) => {
      state.suggestSongLoading = false;
      state.getRoomDetail = action.payload.data;
    },
    suggestSongFailed: state => {
      state.suggestSongLoading = false;
    },

    getRoomDetail: state => {
      state.getRoomDetailLoading = true;
    },
    getRoomDetailSucceeded: (state, action) => {
      state.getRoomDetailLoading = false;
      state.getRoomDetail = action.payload.data;
    },
    getRoomDetailFailed: state => {
      state.getRoomDetailLoading = false;
    },

    createRoom: state => {
      state.createRoomLoading = true;
      state.createRoomError = '';
    },
    createRoomSucceeded: state => {
      state.createRoomLoading = false;
    },
    createRoomFailed: (state, action) => {
      state.createRoomLoading = false;
      state.createRoomError = action.payload.errorMessage;
    },

    updateRoom: state => {
      state.updateRoomLoadingLoading = true;
      state.updateRoomLoadingError = '';
    },
    updateRoomLoadingSucceeded: (state, action) => {
      state.updateRoomLoadingLoading = false;
      state.getRoomDetail = action.payload.data;
    },
    updateRoomLoadingFailed: (state, action) => {
      state.updateRoomLoadingLoading = false;
      state.updateRoomLoadingError = action.payload.errorMessage;
    },

    addListeners: (state, action) => {
      state.listeners = action.payload.listeners;
    },

    fetchRooms: state => {
      state.fetchRoomsLoading = true;
      state.fetchRoomsError = '';
      state.loadMoreRoomsNoMore = false;
    },
    fetchRoomsSucceeded: (state, action) => {
      state.fetchRoomsLoading = false;
      state.rooms = action.payload?.data?.items || [];
    },
    fetchRoomsFailed: (state, action) => {
      state.fetchRoomsLoading = false;
      state.fetchRoomsError = action.payload.errorMessage;
    },

    loadmoreRooms: state => {
      state.loadmoreRoomsLoading = true;
      state.loadmoreRoomsError = '';
    },
    loadmoreRoomsSucceeded: (state, action) => {
      state.loadmoreRoomsLoading = false;
      state.loadmoreRoomsError = '';
      state.rooms.push(...(action.payload?.data?.items || []));
      state.roomsOffset =
        action.payload?.data?.items?.length > 0
          ? state.roomsOffset + LIMIT_ROOM
          : state.roomsOffset;
      state.loadMoreRoomsNoMore = !(action.payload?.data?.items?.length > 0);
    },
    loadmoreRoomsFailed: (state, action) => {
      state.loadmoreRoomsLoading = false;
      state.loadmoreRoomsError = action.payload.errorMessage;
    },

    userJoinRoom: state => {
      state.userJoinRoomLoading = true;
      state.userJoinRoomError = '';
    },
    userJoinRoomSucceeded: state => {
      state.userJoinRoomLoading = false;
    },
    userJoinRoomFailed: (state, action) => {
      state.userJoinRoomLoading = false;
      state.userJoinRoomError = action.payload.errorMessage;
    },

    sendMessage: state => {
      state.sendMessageLoading = false;
      state.sendMessageError = '';
    },
    sendMessageSucceeded: state => {
      state.sendMessageLoading = false;
    },
    sendMessageFailed: (state, action) => {
      state.sendMessageLoading = false;
      state.sendMessageError = action.payload.errorMessage;
    },

    fetchMessageList: state => {
      state.fetchMessageListLoading = true;
      state.fetchMessageListError = '';
      state.loadMoreMessageListNoMore = false;
    },
    fetchMessageListSucceeded: (state, action) => {
      state.fetchMessageListLoading = false;
      state.messageLastId = action.payload?.data[0]?.id || '';
      state.messageList = action.payload?.data.reverse() || [];
    },
    fetchMessageListFailed: (state, action) => {
      state.fetchMessageListLoading = false;
      state.fetchMessageListError = action.payload.errorMessage;
    },

    loadmoreMessageList: state => {
      state.loadmoremessageListLoading = true;
      state.loadmoremessageListError = '';
    },
    loadmoreMessageListSucceeded: (state, action) => {
      state.loadmoremessageListLoading = false;
      state.loadmoremessageListError = '';
      state.messageLastId = action.payload?.data[0]?.id || state.messageLastId;
      state.messageList.push(...(action.payload?.data.reverse() || []));
      state.loadMoremessageListNoMore = !(action.payload?.data?.length > 0);
    },
    loadmoreMessageListFailed: (state, action) => {
      state.loadmoremessageListLoading = false;
      state.loadmoremessageListError = action.payload.errorMessage;
    },

    pushMessageToList: (state, action) => {
      state.messageList = [action.payload.message].concat(state.messageList);
    },

    inviteFriendJoinRoom: state => {
      state.inviteFriendJoinRoomLoading = true;
      state.inviteFriendJoinRoomError = '';
    },
    inviteFriendJoinRoomSucceeded: state => {
      state.inviteFriendJoinRoomLoading = false;
    },
    inviteFriendJoinRoomFailed: (state, action) => {
      state.inviteFriendJoinRoomLoading = false;
      state.inviteFriendJoinRoomError = action.payload.errorMessage;
    },

    acceptInviteRoom: state => {
      state.acceptInviteRoomLoading = true;
      state.acceptInviteRoomError = '';
    },
    acceptInviteRoomSucceeded: state => {
      state.acceptInviteRoomLoading = false;
    },
    acceptInviteRoomFailed: (state, action) => {
      state.acceptInviteRoomLoading = false;
      state.acceptInviteRoomError = action.payload.errorMessage;
    },

    fetchInviteList: state => {
      state.fetchInviteListLoading = true;
      state.fetchInviteListError = '';
    },
    fetchInviteListSucceeded: (state, action) => {
      state.fetchInviteListLoading = false;
      state.inviteList = action.payload?.data;
    },
    fetchInviteListFailed: (state, action) => {
      state.fetchInviteListLoading = false;
      state.fetchInviteListError = action.payload.errorMessage;
    },
  },
});

const { actions, reducer } = roomSlice;

export const {
  createRoom,
  createRoomSucceeded,
  createRoomFailed,
  updateRoom,
  updateRoomLoadingSucceeded,
  updateRoomLoadingFailed,
  addListeners,
  fetchRooms,
  fetchRoomsSucceeded,
  fetchRoomsError,
  loadmoreRooms,
  loadmoreRoomsSucceeded,
  loadmoreRoomsFailed,
  userJoinRoom,
  userJoinRoomSucceeded,
  userJoinRoomFailed,
  getRoomDetail,
  getRoomDetailFailed,
  getRoomDetailSucceeded,
  suggestSong,
  suggestSongSucceeded,
  suggestSongFailed,
  sendMessage,
  sendMessageSucceeded,
  sendMessageFailed,
  fetchMessageList,
  fetchMessageListSucceeded,
  fetchMessageListFailed,
  loadmoreMessageList,
  loadmoreMessageListSucceeded,
  loadmoreMessageListFailed,
  pushMessageToList,
  inviteFriendJoinRoom,
  inviteFriendJoinRoomSucceeded,
  inviteFriendJoinRoomFailed,
  acceptInviteRoom,
  acceptInviteRoomSucceeded,
  acceptInviteRoomFailed,
  fetchInviteList,
  fetchInviteListSucceeded,
  fetchInviteListFailed,
} = actions;

export default reducer;
