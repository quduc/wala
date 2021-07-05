/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socketIo: "",
  loadingCreatePost: false,
  post: {
    items: [],
    total: 0,
  },
  loadingPost: false,
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
    fetchPost: (state) => {
      state.loadingPost = true;
    },
    fetchPostSucceeded: (state, action) => {
      state.loadingPost = false;
      state.post.items = action.payload.items;
      state.post.total = action.payload.total;
    },
    fetchPostFailed: (state) => {
      state.loadingPost = false;
    },
  },
});

const { actions, reducer } = homeSlice;

export const {
  setScoketIo,
  createPost,
  createPostSucceeded,
  createPostFailed,
  fetchPost,
  fetchPostSucceeded,
  fetchPostFailed,
} = actions;

export default reducer;
