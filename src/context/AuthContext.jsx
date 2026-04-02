import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getMe,
  login as loginRequest,
  signup as signupRequest,
  logout as logoutRequest,
} from "../api/users";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const refreshAuth = async () => {
    try {
      const me = await getMe();
      setUser(me);
      setIsAuthenticated(true);
      return me;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      setIsBootstrapping(true);
      await refreshAuth();
      setIsBootstrapping(false);
    };

    bootstrapAuth();
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);

    try {
      await loginRequest(credentials);
      const me = await refreshAuth();
      return me;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (payload) => {
    setIsLoading(true);

    try {
      await signupRequest(payload);
      const me = await refreshAuth();
      return me;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await logoutRequest();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isBootstrapping,
      isLoading,
      refreshAuth,
      login,
      signup,
      logout,
    }),
    [user, isAuthenticated, isBootstrapping, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
