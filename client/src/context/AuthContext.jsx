import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userApiKey, setUserApiKey] = useState(localStorage.getItem('geminiApiKey'));
  
  // 1. ADDED STATE FOR USER PROFILE
  // This will hold all user data, including points, streak, and badges.
  const [userProfile, setUserProfile] = useState(null);

  // 2. ADDED FUNCTION TO FETCH/REFRESH PROFILE
  // This function gets the latest user data from the server.
  const fetchUserProfile = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      setUserProfile(null); // Clear profile if no token
      return;
    }
    try {
      // Use a relative path, assuming proxy is configured
      const res = await axios.get('/api/user/me', {
        headers: { 'x-auth-token': currentToken },
      });
      setUserProfile(res.data); // Store the fetched user profile
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      // If the token is invalid, log the user out
      if (error.response && error.response.status === 401) {
        logout();
      }
    }
  }, []); 

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      localStorage.setItem('token', token);
      // Fetch the user's profile as soon as the token is available
      fetchUserProfile(); 
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      localStorage.removeItem('token');
      setUserProfile(null); // Clear profile on logout
    }
  }, [token, fetchUserProfile]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
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
    isAuthenticated: !!token,
    userApiKey,
    userProfile, // 3. Expose the profile data
    fetchUserProfile, // 4. Expose the refresh function
    saveUserApiKey,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
