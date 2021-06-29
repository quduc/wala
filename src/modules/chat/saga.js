import { put, call, takeEvery, select, takeLatest } from "redux-saga/effects";
import { fetchMessageApi } from "./services";
import {
  fetchMessenger,
  fetchMessengerFailed,
  fetchMessengerSucceed,
} from "./slice";

function* fetchMessageSideEffect({ payload }) {
  try {
    const response = yield call(fetchMessageApi, payload.params);
    yield put(fetchMessengerSucceed(response));
    if (payload.onSuccess) yield call(payload.onSuccess, response);
  } catch (error) {
    yield put(fetchMessengerFailed(error));
    if (payload.onError) yield call(payload.onError, error);
  }
}

export default function* chatSaga() {
  yield takeEvery(fetchMessenger.type, fetchMessageSideEffect);
}
