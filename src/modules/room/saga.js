import { put, call, takeEvery, select, takeLatest } from 'redux-saga/effects';
import {
  createRoom,
  createRoomSucceeded,
  createRoomFailed,
  updateRoom,
  updateRoomLoadingSucceeded,
  updateRoomLoadingFailed,
  fetchRooms,
  fetchRoomsSucceeded,
  fetchRoomsError,
  loadmoreRooms,
  loadmoreRoomsSucceeded,
  loadmoreRoomsFailed,
  getRoomDetail,
  getRoomDetailFailed,
  getRoomDetailSucceeded,
  suggestSong,
  suggestSongSucceeded,
  suggestSongFailed,
  userJoinRoom,
  userJoinRoomSucceeded,
  userJoinRoomFailed,
  sendMessage,
  sendMessageSucceeded,
  sendMessageFailed,
  fetchMessageList,
  fetchMessageListSucceeded,
  fetchMessageListFailed,
  loadmoreMessageList,
  loadmoreMessageListSucceeded,
  loadmoreMessageListFailed,
  inviteFriendJoinRoom,
  inviteFriendJoinRoomSucceeded,
  inviteFriendJoinRoomFailed,
  acceptInviteRoom,
  acceptInviteRoomSucceeded,
  acceptInviteRoomFailed,
  fetchInviteList,
  fetchInviteListSucceeded,
  fetchInviteListFailed,
} from './slice';

import {
  createRoomApi,
  updateRoomApi,
  fetchRoomsApi,
  loadmoreRoomsApi,
  getRoomDetailApi,
  suggestSongApi,
  userJoinRoomApi,
  sendMessageApi,
  fetchMessagesApi,
  loadmoreMessagesApi,
  inviteFriendJoinRoomApi,
  acceptInviteRoomApi,
  fetchInviteListApi,
} from './services';
import { messageLastIdSelector, roomsOffsetSelector } from './selectors';

function* fetchRoomsSideEffect({ payload }) {
  try {
    const response = yield call(fetchRoomsApi, payload.params);
    yield put(fetchRoomsSucceeded(response));
    if (payload.onSuccess) yield call(payload.onSuccess, response);
  } catch (error) {
    yield put(fetchRoomsError(error));
    if (payload.onError) yield call(payload.onError, error);
  }
}

function* loadmoreRoomsSideEffect({ payload }) {
  try {
    const offset = yield select(roomsOffsetSelector);
    const response = yield call(loadmoreRoomsApi, {
      ...payload.data,
      offset: offset + 10,
    });
    yield put(loadmoreRoomsSucceeded(response));
    if (payload.onSuccess) yield call(payload.onSuccess, response);
  } catch (error) {
    yield put(loadmoreRoomsFailed(error));
    if (payload.onError) yield call(payload.onError, error);
  }
}

function* createRoomSideEffect({ payload }) {
  try {
    const response = yield call(createRoomApi, payload.data);
    yield put(createRoomSucceeded(response));
    if (payload.onSuccess) yield call(payload.onSuccess, response);
  } catch (error) {
    yield put(createRoomFailed(error));
    if (payload.onError) yield call(payload.onError, error);
  }
}

function* updateRoomDetailSideEffect({ payload }) {
  try {
    const response = yield call(updateRoomApi, payload.data);
    yield put(updateRoomLoadingSucceeded(response));
    if (payload.onSuccess) yield call(payload.onSuccess, response);
  } catch (error) {
    yield put(updateRoomLoadingFailed(error));
    if (payload.onError) yield call(payload.onError, error);
  }
}

function* getRoomDetailSideEffect({ payload }) {
  try {
    const response = yield call(getRoomDetailApi, payload.data);
    yield put(getRoomDetailSucceeded(response));
    if (payload.onSuccess) yield call(payload.onSuccess, response);
  } catch (error) {
    yield put(getRoomDetailFailed(error));
    if (payload.onError) yield call(payload.onError, error);
  }
}

function* suggestSongSideEffect({ payload }) {
  try {
    const response = yield call(suggestSongApi, payload.data);
    yield put(suggestSongSucceeded(response));
    if (payload.onSuccess) yield call(payload.onSuccess, response);
    yield call(getRoomDetailSideEffect, {
      payload: {
        data: { roomId: payload.data.roomId },
      },
    });
  } catch (error) {
    yield put(suggestSongFailed(error));
    if (payload.onError) yield call(payload.onError, error);
  }
}

function* userJoinRoomSideEffect({ payload }) {
  try {
    const response = yield call(userJoinRoomApi, payload.data);
    yield put(userJoinRoomSucceeded(response));
    if (payload.onSuccess) yield call(payload.onSuccess, response);
  } catch (error) {
    yield put(userJoinRoomFailed(error));
    if (payload.onError) yield call(payload.onError, error);
  }
}

function* sendMessageSideEffect({ payload }) {
  try {
    const response = yield call(sendMessageApi, payload.data);
    yield put(sendMessageSucceeded(response));
    if (payload.onSuccess) yield call(payload.onSuccess, response);
  } catch (error) {
    yield put(sendMessageFailed(error));
    if (payload.onError) yield call(payload.onError, error);
  }
}

function* fetchMessageListSideEffect({ payload }) {
  try {
    const response = yield call(fetchMessagesApi, payload.data);
    yield put(fetchMessageListSucceeded(response));
    if (payload.onSuccess) yield call(payload.onSuccess, response);
  } catch (error) {
    yield put(fetchMessageListFailed(error));
    if (payload.onError) yield call(payload.onError, error);
  }
}

function* loadmoreMessageListSideEffect({ payload }) {
  try {
    const lastId = yield select(messageLastIdSelector);
    const response = yield call(loadmoreMessagesApi, {
      ...payload.data,
      lastId,
    });
    yield put(loadmoreMessageListSucceeded(response));
    if (payload.onSuccess) yield call(payload.onSuccess, response);
  } catch (error) {
    yield put(loadmoreMessageListFailed(error));
    if (payload.onError) yield call(payload.onError, error);
  }
}

function* inviteFriendJoinRoomSideEffect({ payload }) {
  try {
    const response = yield call(inviteFriendJoinRoomApi, payload.data);
    yield put(inviteFriendJoinRoomSucceeded(response));
    if (payload.onSuccess) yield call(payload.onSuccess, response);
  } catch (error) {
    yield put(inviteFriendJoinRoomFailed(error));
    if (payload.onError) yield call(payload.onError, error);
  }
}

function* acceptInviteRoomSideEffect({ payload }) {
  try {
    const response = yield call(acceptInviteRoomApi, payload.data);
    yield put(acceptInviteRoomSucceeded(response));
    if (payload.onSuccess) yield call(payload.onSuccess, response);
  } catch (error) {
    yield put(acceptInviteRoomFailed(error));
    if (payload.onError) yield call(payload.onError, error);
  }
}

function* fetchInviteListSideEffect({ payload }) {
  try {
    const response = yield call(fetchInviteListApi, payload.data);
    yield put(fetchInviteListSucceeded(response));
    if (payload.onSuccess) yield call(payload.onSuccess, response);
  } catch (error) {
    yield put(fetchInviteListFailed(error));
    if (payload.onError) yield call(payload.onError, error);
  }
}

export default function* roomSaga() {
  yield takeEvery(createRoom.type, createRoomSideEffect);
  yield takeEvery(updateRoom.type, updateRoomDetailSideEffect);
  yield takeEvery(fetchRooms.type, fetchRoomsSideEffect);
  yield takeEvery(loadmoreRooms.type, loadmoreRoomsSideEffect);
  yield takeEvery(getRoomDetail.type, getRoomDetailSideEffect);
  yield takeLatest(suggestSong.type, suggestSongSideEffect);
  yield takeEvery(userJoinRoom.type, userJoinRoomSideEffect);
  yield takeEvery(sendMessage.type, sendMessageSideEffect);
  yield takeEvery(fetchMessageList.type, fetchMessageListSideEffect);
  yield takeEvery(loadmoreMessageList.type, loadmoreMessageListSideEffect);
  yield takeEvery(inviteFriendJoinRoom.type, inviteFriendJoinRoomSideEffect);
  yield takeEvery(acceptInviteRoom.type, acceptInviteRoomSideEffect);
  yield takeEvery(fetchInviteList.type, fetchInviteListSideEffect);
}
