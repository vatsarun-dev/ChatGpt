import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import PageLoader from "../components/PageLoader.jsx";

const ProtectedChat = () => {
  const { isAuthenticated, isLoading } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/");
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return <PageLoader text="Loading your workspace..." />;

  return <Outlet />;
};

export default ProtectedChat;
