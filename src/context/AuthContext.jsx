import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  getMe,
  login as loginRequest,
  signup as signupRequest,
  logout as logoutRequest,
} from "../api/users";

const AuthContext = createContext(null);

let resolveBootstrap;
export const bootstrapPromise = new Promise((resolve) => {
  resolveBootstrap = resolve;
});

const BOOTSTRAP_TIMEOUT_MS = 3000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = Boolean(user?.id);

  const refreshAuth = useCallback(async () => {
    try {
      const me = await getMe();

      const userData = me?.user ?? me;
      if (userData?.id) {
        setUser(userData);
        return userData;
      }
      setUser(null);
      return null;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsBootstrapping(false);
      resolveBootstrap();
    }, BOOTSTRAP_TIMEOUT_MS);

    refreshAuth().finally(() => {
      clearTimeout(timeoutId);
      setIsBootstrapping(false);
      resolveBootstrap();
    });
  }, [refreshAuth]);

  const login = useCallback(
    async (credentials) => {
      setIsLoading(true);
      try {
        await loginRequest(credentials);
        return await refreshAuth();
      } finally {
        setIsLoading(false);
      }
    },
    [refreshAuth],
  );

  const signup = useCallback(
    async (payload) => {
      setIsLoading(true);
      try {
        await signupRequest(payload);
        return await refreshAuth();
      } finally {
        setIsLoading(false);
      }
    },
    [refreshAuth],
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutRequest();
    } catch {
      // Back mort → on déconnecte quand même localement
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

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
    [
      user,
      isAuthenticated,
      isBootstrapping,
      isLoading,
      refreshAuth,
      login,
      signup,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
