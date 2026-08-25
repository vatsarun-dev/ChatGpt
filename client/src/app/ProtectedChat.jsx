import React from "react";
import { Navigate, Outlet } from "react-router/dom";
const ProtectedChat = () => {
  if (!logged) <Navigate to="/" />;
  return <Outlet />;
};

export default ProtectedChat;
