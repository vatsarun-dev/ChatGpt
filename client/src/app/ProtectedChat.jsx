import { React, useEffect } from "react";
import { useNavigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
const ProtectedChat = () => {
  const Login = useSelector((store) => store.auth.isAuthenticated);
  const navigate = useNavigate();
  console.log(Login);
  useEffect(() => {
    if (!Login) navigate("/");
  }, [Login, navigate]);
  return <Outlet />;
};

export default ProtectedChat;
