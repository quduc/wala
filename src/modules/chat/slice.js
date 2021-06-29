/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messenger: [],
  loadingFetchMessenger: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    fetchMessenger: (state) => {
      state.loadingFetchMessenger = true;
    },
    fetchMessengerSucceed: (state, action) => {
      state.loadingFetchMessenger = false;
      state.messenger = action.payload.data;
    },
    fetchMessengerFailed: (state) => {
      state.loadingFetchMessenger = false;
    },
  },
});

const { actions, reducer } = chatSlice;

export const { fetchMessenger, fetchMessengerSucceed, fetchMessengerFailed } =
  actions;

export default reducer;
