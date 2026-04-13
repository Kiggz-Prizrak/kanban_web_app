import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const PUBLIC_ROUTES = ["/login", "/signup"];

const Root = () => {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  useEffect(() => {
    if (isBootstrapping) return;
    if (isAuthenticated && isPublicRoute) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isBootstrapping, isPublicRoute, navigate]);

  return <Outlet />;
};

export default Root;
