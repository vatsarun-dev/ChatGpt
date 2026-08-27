import React from "react";
import { redirect, Outlet } from "react-router";
import { useSelector } from "react-redux";

const ProtectedAuth = () => {
  const Login = useSelector((store) => store.auth.isAuthenticated);

  if (Login) redirect("/chat");
  return <Outlet />;
};

export default ProtectedAuth;
