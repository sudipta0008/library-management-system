import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // CHECK EXISTING SESSION
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem(
      "libraryos-token"
    );

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchAdmin = async () => {
      try {
        const response = await api.get(
          "/auth/me"
        );

        setAdmin(response.data.data);

      } catch (error) {
        console.error(
          "Authentication check failed:",
          error
        );

        localStorage.removeItem(
          "libraryos-token"
        );

        setAdmin(null);

      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  // =====================================================
  // LOGIN
  // =====================================================

  const login = async (
    email,
    password
  ) => {
    const response = await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    const token =
      response.data.data.token;

    localStorage.setItem(
      "libraryos-token",
      token
    );

    setAdmin(
      response.data.data.admin
    );

    return response.data;
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem(
      "libraryos-token"
    );

    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated: !!admin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}