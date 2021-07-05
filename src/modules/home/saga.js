import { put, call, takeEvery, select } from "redux-saga/effects";
import {
  addLike,
  addLikeFailed,
  addLikeSucceeded,
  createPost,
  createPostFailed,
  createPostSucceeded,
  fetchPost,
  fetchPostFailed,
  fetchPostSucceeded,
} from "./slice";

import { addLikeApi, createPostApi, fetchPostApi } from "./services";

function* createPostSideEffect({ payload }) {
  try {
    const response = yield call(createPostApi, payload.data);
    yield put(createPostSucceeded(response));
    if (payload.onSuccess) yield call(payload.onSuccess, response);
  } catch (error) {
    yield put(createPostFailed(error));
    if (payload.onError) yield call(payload.onError, error);
  }
}

function* fetchPostSideEffect({ payload }) {
  try {
    const response = yield call(fetchPostApi);
    yield put(fetchPostSucceeded(response));
    if (payload.onSuccess) yield call(payload.onSuccess, response);
  } catch (error) {
    yield put(fetchPostFailed(error));
    if (payload.onError) yield call(payload.onError, error);
  }
}

function* addLikeSideEffect({ payload }) {
  try {
    const response = yield call(addLikeApi , payload.data);
    yield put(addLikeSucceeded(response));
    if (payload.onSuccess) yield call(payload.onSuccess, response);
  } catch (error) {
    yield put(addLikeFailed(error));
    if (payload.onError) yield call(payload.onError, error);
  }
}

export default function* homeSaga() {
  yield takeEvery(createPost.type, createPostSideEffect);
  yield takeEvery(fetchPost.type, fetchPostSideEffect);
  yield takeEvery(addLike.type, addLikeSideEffect);
}
