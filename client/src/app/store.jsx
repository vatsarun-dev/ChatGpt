import { configureStore } from "@reduxjs/toolkit";
import authReducers from "../feature/auth/state/authReducers.jsx";
export const store = configureStore({
  reducer: {
    auth: authReducers,
  },
});
