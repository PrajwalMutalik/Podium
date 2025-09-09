// src/context/QuotaContext.jsx

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Assuming you have an AuthContext that provides the token

const QuotaContext = createContext();

export const useQuota = () => useContext(QuotaContext);

export const QuotaProvider = ({ children }) => {
  const [quota, setQuota] = useState({ currentUsage: 0, dailyLimit: 10 });
  const [isLoading, setIsLoading] = useState(true);
  const { token, userApiKey } = useAuth(); // Get the auth token and API key

  const fetchQuota = useCallback(async () => {
    if (!token) {
      setQuota({ currentUsage: 0, dailyLimit: 10 });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/interview/check-quota', {
        headers: {
          'x-auth-token': token,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setQuota(data);
      }
    } catch (error) {
      console.error('Failed to fetch quota:', error);
      // Fallback quota
      setQuota({ 
        currentUsage: 0, 
        dailyLimit: userApiKey ? 'Unlimited' : 10 
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, userApiKey]);

  // Auto-fetch quota when token or API key changes
  useEffect(() => {
    fetchQuota();
  }, [fetchQuota]);

  const value = { quota, fetchQuota, isLoading };

  return (
    <QuotaContext.Provider value={value}>
      {children}
    </QuotaContext.Provider>
  );
};