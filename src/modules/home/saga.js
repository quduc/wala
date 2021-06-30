import { put, call, takeEvery, select } from "redux-saga/effects";
import { createPost, createPostFailed, createPostSucceeded } from "./slice";

import { createPostApi } from "./services";

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

export default function* homeSaga() {
  yield takeEvery(createPost.type, createPostSideEffect);
}
