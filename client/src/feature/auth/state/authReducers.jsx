import { createSlice } from "@reduxjs/toolkit";

const authReducers = createSlice({
  name: "authReducers",
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    logIn: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logOut: (state, action) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});
export let { logIn, logOut } = authReducers.actions;
export default authReducers.reducer;
