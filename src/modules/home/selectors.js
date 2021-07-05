import { createSelector } from "reselect";

const homeSelector = (state) => state.home;

export const SocketIoSelector = createSelector(
  homeSelector,
  (homeReducer) => homeReducer.socketIo
);

export const loadingCreatePostSelector = createSelector(
  homeSelector,
  (homeReducer) => homeReducer.loadingCreatePost
);

export const loadingFetchPostSelector = createSelector(
  homeSelector,
  (homeReducer) => homeReducer.loadingPost
);

export const postSelector = createSelector(
  homeSelector,
  (homeReducer) => homeReducer.post
);
