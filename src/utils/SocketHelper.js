/* eslint-disable import/no-mutable-exports */
import io from 'socket.io-client';
import { getBaseURLWithMode } from '@common/baseApi';
import { LIVE_NAMESPACE } from '@common/config';
import { signOut } from '@modules/auth/slice';
import Toast from 'react-native-toast-message';
import { store } from '../redux/configStore';

let socketIo = null;

export const initSocket = async (token, cb) => {
  const baseURL = await getBaseURLWithMode();
  socketIo = io(`${baseURL}${LIVE_NAMESPACE}`, {
    query: `auth_token=${token}`,
    transports: ['websocket'],
  });

  if (socketIo) {
    cb(socketIo);
    console.log('-------------------connect socket------------------');
  }
};

export const checkConnectSocket = socketIo => {
  console.log('socket connected', socketIo.connected);
  if (!socketIo.connected) {
    store.dispatch(signOut());
    return Toast.show({
      type: 'error',
      props: {
        message: 'Something went wrong',
        onClose: () => Toast.hide(),
      },
    });
  }

  return true;
};

export const disconnectSocket = () => {
  console.log('-------------------disconnecting socket------------------');
  if (socketIo) {
    socketIo.disconnect();
  }
};
