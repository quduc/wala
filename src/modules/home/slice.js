/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import reactotron from "reactotron-react-native";

const initialState = {
  socketIo: "",
  loadingCreatePost: false,
  post: {
    items: [],
    total: 0,
  },
  loadingPost: false,
  loadingLoadMore: false,
  loadMoreOffset: 0,
  loadingAddComment: false,
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
      state.loadMoreOffset = 0;
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
    addLike: (state) => {},
    addLikeSucceeded: (state, action) => {
      const index = state.post.items.findIndex((item) => {
        return item?.id == action.payload?.data?.postId;
      });
      if (index !== -1) {
        state.post.items[index].isLiked = !state.post.items[index].isLiked;
      }
    },
    addLikeFailed: () => {},
    loadMorePost: (state) => {
      state.loadingLoadMore = true;
    },
    loadMorePostSucceeded: (state, action) => {
      state.loadingLoadMore = false;
      state.post.items = [...action.payload?.items, ...state.post.items];
      state.loadMoreOffset =
        action.payload?.items?.length > 0
          ? state.loadMoreOffset + 10
          : state.loadMoreOffset;
    },
    loadMorePostFailed: (state) => {
      state.loadingLoadMore = false;
    },
    addComment: (state) => {
      state.loadingAddComment = true;
    },
    addCommentSucceeded: (state, action) => {
      const index = state.post.items.findIndex(
        (item) => item.id === action.payload?.data?.postId
      );
      state.loadingAddComment = false;
      state.post.items[index].members.push(action.payload?.data);
    },
    addCommentFailed: (state) => {
      state.loadingAddComment = true;
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
  addLike,
  addLikeSucceeded,
  addLikeFailed,
  loadMorePost,
  loadMorePostSucceeded,
  loadMorePostFailed,
  addComment,
  addCommentSucceeded,
  addCommentFailed,
} = actions;

export default reducer;
