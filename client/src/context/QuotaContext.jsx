import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const QuotaContext = createContext();

export const useQuota = () => useContext(QuotaContext);

export const QuotaProvider = ({ children }) => {
  const [quota, setQuota] = useState({ currentUsage: 0, dailyLimit: 10 });
  const [isLoading, setIsLoading] = useState(true);
  const { token, userApiKey } = useAuth();

  const VITE_BACKEND_URL = import.meta.env.VITE_VITE_BACKEND_URL;

  const fetchQuota = useCallback(async () => {
    if (!token) {
      setQuota({ currentUsage: 0, dailyLimit: 10 });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`${VITE_BACKEND_URL}/api/interview/check-quota`, {
        headers: {
          'x-auth-token': token,
        },
      });
      setQuota(response.data);
    } catch (error) {
      console.error('Failed to fetch quota:', error);
      // Fallback quota
      setQuota({
        currentUsage: 0,
        dailyLimit: userApiKey ? 'Unlimited' : 10,
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, userApiKey, VITE_BACKEND_URL]);

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
