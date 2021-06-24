import { all } from 'redux-saga/effects';
import userSaga from '@modules/user/saga';
import authSaga from '@modules/auth/saga';
import roomSaga from '@modules/room/saga';
import uploadFileSaga from '@modules/uploadFile/saga';
import notificationSaga from '@modules/notification/saga';
import profileSaga from '@modules/profile/saga';

function* rootSaga() {
  yield all([
    authSaga(),
    userSaga(),
    roomSaga(),
    uploadFileSaga(),
    notificationSaga(),
    profileSaga(),
  ]);
}
export default rootSaga;
