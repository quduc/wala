import { createSelector } from 'reselect';

const homeSelector = state => state.home;

export const SocketIoSelector = createSelector(
  homeSelector,
  homeReducer => homeReducer.socketIo,
);
