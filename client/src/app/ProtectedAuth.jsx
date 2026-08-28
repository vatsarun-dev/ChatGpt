import { React, useEffect } from "react";
import { useNavigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const ProtectedAuth = () => {
  const Login = useSelector((store) => store.auth.isAuthenticated);
  const navigate = useNavigate();
  useEffect(() => {
    if (Login) navigate("/chat");
  }, [Login, navigate]);
  return <Outlet />;
};

export default ProtectedAuth;
