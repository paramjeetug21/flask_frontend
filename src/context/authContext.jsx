import React, { createContext, useContext, useState, useEffect } from "react";
import * as authApi from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const fetchUserDashboard = async () => {
    try {
      const id = localStorage.getItem("token");
      const res = await authApi.fetchDashboard(id);
    } catch {
      logout();
    }
  };

  const signup = async ({ name, email, password, photo }) => {
    setLoading(true);
    try {
      await authApi.signup({ name, email, password, photo });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.response?.data?.error || "Signup failed" };
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      setToken(res.data.user._id);
      setUserData(res.data);
      localStorage.setItem("userData", JSON.stringify(res.data));
      localStorage.setItem("token", res.data.user._id);

      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.error || "Invalid credentials",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserData(null);
  };

  const updateProfile = async ({ name, photo }) => {
    setUpdateLoading(true);
    try {
      await authApi.updateProfile(token, { name, photo });
      await fetchUserDashboard();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    } finally {
      setUpdateLoading(false);
    }
  };

  const deleteAccount = async () => {
    try {
      await authApi.deleteAccount(token);
      logout();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <AuthContext.Provider
      value={{
        token,
        userData,
        loading,
        updateLoading,
        darkMode,
        signup,
        login,
        logout,
        fetchUserDashboard,
        updateProfile,
        deleteAccount,
        toggleDarkMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook for easy context usage
export const useAuth = () => useContext(AuthContext);
