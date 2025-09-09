import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuota } from '../context/QuotaContext';
import axios from 'axios';

const SettingsPage = () => {
  const { userApiKey, saveUserApiKey, removeUserApiKey } = useAuth();
  const { quota, fetchQuota, isLoading } = useQuota();
  const [apiKey, setApiKey] = useState(userApiKey || '');
  const [saveToDatabase, setSaveToDatabase] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Sync local state with context when userApiKey changes
  useEffect(() => {
    setApiKey(userApiKey || '');
    // Refresh quota when API key changes
    fetchQuota();
  }, [userApiKey, fetchQuota]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsVerifying(true);
    
    try {
      // Always save to localStorage for session use
      saveUserApiKey(apiKey);
      
      // Optionally save to database for persistent storage (with verification)
      if (saveToDatabase) {
        const token = localStorage.getItem('token');
        const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
        const response = await axios.post(`${baseUrl}/api/user/update-api-key`, 
          { geminiApiKey: apiKey },
          { headers: { 'x-auth-token': token } }
        );
        
        if (response.data.verified) {
          alert(`✅ ${response.data.msg}`);
        } else if (!response.data.hasApiKey) {
          alert(`🗑️ ${response.data.msg}`);
        } else {
          alert('API Key saved locally for this session!');
        }
        
        // Refresh quota after saving
        await fetchQuota();
      } else {
        if (apiKey.trim() === '') {
          alert('API Key removed from this session. You now have 10 requests per day.');
        } else {
          alert('API Key saved locally for this session!');
        }
      }
    } catch (error) {
      console.error('Error saving API key:', error);
      
      if (error.response && error.response.data.error === 'API_KEY_INVALID') {
        alert('❌ Invalid API key. Please check your Gemini API key and try again.');
      } else {
        alert('Error saving API key to database. It has been saved locally for this session.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRemoveKey = async () => {
    if (!window.confirm('Are you sure you want to remove your API key? You will be limited to 10 requests per day.')) {
      return;
    }

    setIsVerifying(true);
    
    try {
      // Clear from context and localStorage immediately (updates UI)
      removeUserApiKey();
      setApiKey(''); // Update local state to hide the key in the form
      
      // Remove from database as well
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
      const response = await axios.post(`${baseUrl}/api/user/update-api-key`, 
        { geminiApiKey: '' },
        { headers: { 'x-auth-token': token } }
      );
      
      alert(`🗑️ ${response.data.msg}`);
      
      // Refresh quota after removal
      await fetchQuota();
    } catch (error) {
      console.error('Error removing API key:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(error.response.data.msg || 'Error removing API key. Please try again.');
      } else {
        alert('API key removed locally. You may need to refresh to see changes.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="glass-container">
      <h1>API Key Settings</h1>
      <p>
        To avoid using the site's shared API quota, you can provide your own Google Gemini API key here. 
        Your key can be saved locally (session only) or to your account for persistent use.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="apiKey">Your Google Gemini API Key:</label>
          <input
            type="password" // Use password type to obscure the key
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={saveToDatabase}
              onChange={(e) => setSaveToDatabase(e.target.checked)}
            />
            Save to my account (persistent across sessions)
          </label>
          <small>
            If unchecked, the key will only be saved locally for this session.
          </small>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" disabled={isVerifying}>
            {isVerifying ? 'Verifying API Key...' : 'Save Key'}
          </button>
          
          {apiKey && (
            <button 
              type="button" 
              onClick={handleRemoveKey} 
              disabled={isVerifying}
              style={{ 
                backgroundColor: '#ef4444', 
                borderColor: '#ef4444' 
              }}
            >
              Remove Key
            </button>
          )}
        </div>
      </form>
      
      <div className={`api-status-card ${apiKey ? 'active' : 'limited'}`}>
        {apiKey ? (
          <>
            <h3>✅ Custom API Key Active</h3>
            <p><strong>Status:</strong> Unlimited usage with your own Gemini API key!</p>
            <p><strong>Daily Limit:</strong> {isLoading ? 'Loading...' : quota.dailyLimit}</p>
            <p><small>Your key is being used for all interview sessions.</small></p>
          </>
        ) : (
          <>
            <h3>⚠️ Using Shared API</h3>
            <p><strong>Status:</strong> Limited to 10 requests per day</p>
            {!isLoading && (
              <p><strong>Usage Today:</strong> {quota.currentUsage} / {quota.dailyLimit} requests</p>
            )}
            <p><small>Add your own Gemini API key above for unlimited usage.</small></p>
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
