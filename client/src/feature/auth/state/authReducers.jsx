import { createSlice } from "@reduxjs/toolkit";

const authReducers = createSlice({
  name: "authReducers",
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  },
  reducers: {
    logIn: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logOut: (state, action) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = true;
    },

    stopAuthLoading: (state) => {
      state.isLoading = false;
    },
  },
});
export let { logIn, logOut, stopAuthLoading } = authReducers.actions;
export default authReducers.reducer;
