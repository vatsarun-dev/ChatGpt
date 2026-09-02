import { React, useEffect } from "react";
import { useNavigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const ProtectedAuth = () => {
  const { isAuthenticated, isLoading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  console.log("ProtectedAuth - isAuthenticated:", isAuthenticated); // Better debug

  useEffect(() => {
    if (isAuthenticated) navigate("/chat");
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return <div>Loading..</div>;

  return <Outlet />;
};

export default ProtectedAuth;
