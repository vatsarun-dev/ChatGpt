import React from "react";
import Router from "./Router.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { refreshApi, getMeApi } from "../feature/auth/service/authService.js";
import { logIn, stopAuthLoading } from "../feature/auth/state/authReducers.jsx";
const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refreshApi();
        const user = await getMeApi();
        dispatch(logIn(user.data.user));
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(stopAuthLoading());
      }
    };
    checkAuth();
  }, [dispatch]);
  return (
    <div>
      <Router />
    </div>
  );
};

export default App;
