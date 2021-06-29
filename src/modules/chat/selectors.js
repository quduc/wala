import { createSelector } from "reselect";

const chatSelector = (state) => state.chat;

export const loadingFetchMessageSelector = createSelector(
  chatSelector,
  (chatReducer) => chatReducer.loadingFetchMessenger
);

export const messengerSelector = createSelector(
  chatSelector,
  (chatReducer) => chatReducer.messenger
);
