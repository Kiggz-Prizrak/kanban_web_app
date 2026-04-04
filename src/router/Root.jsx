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

    // Redirige les connectés qui tentent d'accéder à /login ou /signup
    if (isAuthenticated && isPublicRoute) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isBootstrapping, isPublicRoute, navigate]);

  // Pendant le bootstrap on n'affiche rien — évite le flash de contenu
  if (isBootstrapping) return null;

  return <Outlet />;
};

export default Root;
