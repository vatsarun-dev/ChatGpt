import React from "react";
import { redirect, Outlet } from "react-router";
import { useSelector } from "react-redux";
const ProtectedChat = () => {
  const Login = useSelector((store) => store.auth.isAuthenticated);
  if (!Login) redirect("/");
  return <Outlet />;
};

export default ProtectedChat;
