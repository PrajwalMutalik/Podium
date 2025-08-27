// src/context/QuotaContext.jsx

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext'; // Assuming you have an AuthContext that provides the token

const QuotaContext = createContext();

export const useQuota = () => useContext(QuotaContext);

export const QuotaProvider = ({ children }) => {
  const [quota, setQuota] = useState({ currentUsage: 0, dailyLimit: 10 });
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth(); // Get the auth token

  const fetchQuota = useCallback(async () => {
    if (!token) return; // Don't fetch if not logged in

    try {
      setIsLoading(true);
      const response = await fetch('/api/interview/check-quota', {
        headers: {
          'x-auth-token': token, // Make sure your auth middleware uses this header
        },
      });
      const data = await response.json();
      if (response.ok) {
        setQuota(data);
      }
    } catch (error) {
      console.error('Failed to fetch quota:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const value = { quota, fetchQuota, isLoading };

  return (
    <QuotaContext.Provider value={value}>
      {children}
    </QuotaContext.Provider>
  );
};