import { React, useEffect } from "react";
import { useNavigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
const ProtectedChat = () => {
  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);
  const navigate = useNavigate();
  console.log("ProtectedChat - isAuthenticated:", isAuthenticated); // Better debug

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  return <Outlet />;
};

export default ProtectedChat;
