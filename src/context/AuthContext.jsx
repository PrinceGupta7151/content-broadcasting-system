import React, { createContext, useState, useEffect } from 'react';
import { getToken, setToken, removeToken, getUser, setUser as setUserData, removeUser } from '../utils/storage';
import authService from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());
  const [token, setTokenState] = useState(getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = getToken();
    const savedUser = getUser();

    if (savedToken && savedUser) {
      setTokenState(savedToken);
      setUser(savedUser);
      verifyToken(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (tkn) => {
    try {
      const response = await authService.verifyToken();
      setUser(response.user);
      setUserData(response.user);
    } catch (error) {
      removeToken();
      removeUser();
      setTokenState(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      setToken(response.token);
      setTokenState(response.token);
      setUser(response.user);
      setUserData(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    removeToken();
    removeUser();
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};