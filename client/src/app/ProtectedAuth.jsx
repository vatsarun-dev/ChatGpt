import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import PageLoader from "../components/PageLoader.jsx";

const ProtectedAuth = () => {
  const { isAuthenticated, isLoading } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/chat");
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return <PageLoader text="Connecting to server..." />;

  return <Outlet />;
};

export default ProtectedAuth;
