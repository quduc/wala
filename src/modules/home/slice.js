/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  socketIo: '',
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setScoketIo: (state, action) => {
      state.socketIo = action.payload.socketIo;
    },
  },
});

const { actions, reducer } = homeSlice;

export const { setScoketIo } = actions;

export default reducer;
