/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import reactotron from "reactotron-react-native";

const initialState = {
  socketIo: "",

  loadingCreatePost: false,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setScoketIo: (state, action) => {
      state.socketIo = action.payload.socketIo;
    },
    createPost: (state) => {
      state.loadingCreatePost = true;
    },
    createPostSucceeded: (state) => {
      state.loadingCreatePost = false;
    },
    createPostFailed: (state) => {
      state.loadingCreatePost = false;
    },
  },
});

const { actions, reducer } = homeSlice;

export const {
  setScoketIo,
  createPost,
  createPostSucceeded,
  createPostFailed,
} = actions;

export default reducer;
