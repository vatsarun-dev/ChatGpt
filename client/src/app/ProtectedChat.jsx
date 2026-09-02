import { React, useEffect } from "react";
import { useNavigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
const ProtectedChat = () => {
  const { isAuthenticated, isLoading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  console.log("ProtectedChat - isAuthenticated:", isAuthenticated); // Better debug

  useEffect(() => {
    if (!isAuthenticated && !isAuthenticated) navigate("/");
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return <div>Loading...</div>;

  return <Outlet />;
};

export default ProtectedChat;
