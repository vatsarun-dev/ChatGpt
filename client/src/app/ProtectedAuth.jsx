import { React, useEffect } from "react";
import { useNavigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const ProtectedAuth = () => {
  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);
  const navigate = useNavigate();
  console.log("ProtectedAuth - isAuthenticated:", isAuthenticated); // Better debug

  useEffect(() => {
    if (isAuthenticated) navigate("/chat");
  }, [isAuthenticated, navigate]);

  return <Outlet />;
};

export default ProtectedAuth;
