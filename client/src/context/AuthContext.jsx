import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userApiKey, setUserApiKey] = useState(localStorage.getItem('geminiApiKey'));
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  
    setUserApiKey(null);
    localStorage.removeItem('geminiApiKey');
  };
  const saveUserApiKey = (key) => {
    localStorage.setItem('geminiApiKey', key);
    setUserApiKey(key);
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    userApiKey, 
    saveUserApiKey, 
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
