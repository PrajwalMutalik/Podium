import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useQuota } from '../context/QuotaContext';
import { BASE_URL } from '../config/api';
import './SettingsPage.css';

const SettingsPage = () => {
  const { userApiKey, saveUserApiKey, removeUserApiKey, userProfile, fetchUserProfile } = useAuth();
  const { quota, fetchQuota, isLoading } = useQuota();

  // API Key State
  const [apiKey, setApiKey] = useState(userApiKey || '');
  const [saveToDatabase, setSaveToDatabase] = useState(false);
  const [isVerifyingKey, setIsVerifyingKey] = useState(false);

  // Profile State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    setApiKey(userApiKey || '');
    if (userProfile) {
      setName(userProfile.name || '');
      setUsername(userProfile.username || '');
    }
    fetchQuota();
  }, [userApiKey, userProfile, fetchQuota]);

  // Handle Profile Update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BASE_URL}/api/user/profile`,
        { name, username },
        { headers: { 'x-auth-token': token } }
      );

      await fetchUserProfile();
      alert('✅ Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response && error.response.data.msg) {
        alert(`❌ ${error.response.data.msg}`);
      } else {
        alert('Failed to update profile.');
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle API Key Submit
  const handleKeySubmit = async (e) => {
    e.preventDefault();
    setIsVerifyingKey(true);

    try {
      saveUserApiKey(apiKey);

      if (saveToDatabase) {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${BASE_URL}/api/user/update-api-key`,
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
        await fetchQuota();
      } else {
        alert(apiKey.trim() === ''
          ? 'API Key removed from session.'
          : 'API Key saved locally for this session!');
      }
    } catch (error) {
      console.error('Error saving API key:', error);
      if (error.response && error.response.data.error === 'API_KEY_INVALID') {
        alert('❌ Invalid API key.');
      } else {
        alert('Error saving API key. Saved locally as fallback.');
      }
    } finally {
      setIsVerifyingKey(false);
    }
  };

  const handleRemoveKey = async () => {
    if (!window.confirm('Remove your custom API key?')) return;

    setIsVerifyingKey(true);
    try {
      removeUserApiKey();
      setApiKey('');

      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/user/update-api-key`,
        { geminiApiKey: '' },
        { headers: { 'x-auth-token': token } }
      );

      await fetchQuota();
      alert('API Key removed successfully.');
    } catch (error) {
      alert('Failed to remove key from server, but removed locally.');
    } finally {
      setIsVerifyingKey(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings & Preferences</h1>
        <p>Manage your account, API keys, and customizations.</p>
      </div>

      {/* ACCOUNT SECTION (Editable) */}
      <div className="settings-section">
        <div className="section-title">
          <span className="section-icon">👤</span>
          <h2>Account Profile</h2>
        </div>
        <form onSubmit={handleProfileUpdate}>
          <div className="input-group">
            <label className="input-label">Display Name</label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label">Unique Username</label>
            <input
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Create a unique username"
            />
            <span className="input-helper">This must be unique across all users.</span>
          </div>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              className="input-field"
              value={userProfile?.email || ''}
              disabled
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>
          <button type="submit" className="btn-save" disabled={isSavingProfile}>
            {isSavingProfile ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {/* API KEY SECTION */}
      <div className="settings-section">
        <div className="section-title">
          <span className="section-icon">🔑</span>
          <h2>Gemini API Configuration</h2>
        </div>

        <form onSubmit={handleKeySubmit}>
          <div className="input-group">
            <label htmlFor="apiKey" className="input-label">Your Gemini API Key</label>
            <input
              type="password"
              id="apiKey"
              className="input-field"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Ex: AIzaSy..."
            />
            <span className="input-helper">
              Provide your own key to bypass daily feedback limits.
            </span>
          </div>

          <label className="checkbox-wrapper">
            <input
              type="checkbox"
              className="checkbox-input"
              checked={saveToDatabase}
              onChange={(e) => setSaveToDatabase(e.target.checked)}
            />
            <div>
              <span className="checkbox-label">Save to my account securely</span>
              <span className="checkbox-desc">
                If unchecked, the key is only saved in your browser for this session.
              </span>
            </div>
          </label>

          <div className="btn-group">
            <button type="submit" className="btn-save" disabled={isVerifyingKey}>
              {isVerifyingKey ? 'Verifying...' : 'Save Configuration'}
            </button>

            {apiKey && (
              <button
                type="button"
                className="btn-remove"
                onClick={handleRemoveKey}
                disabled={isVerifyingKey}
              >
                Remove Key
              </button>
            )}
          </div>
        </form>

        {/* STATUS INDICATOR */}
        <div className={`status-card ${apiKey ? 'active' : 'limited'}`}>
          <div className="status-icon">
            {apiKey ? '✅' : '⚠️'}
          </div>
          <div className="status-content">
            <h3>{apiKey ? 'Unlimited Access Active' : 'Daily Limit Active'}</h3>
            <p>
              {apiKey
                ? 'You are using your own API key. No usage limits apply.'
                : `You are on the free tier. ${quota.currentUsage} / ${quota.dailyLimit} requests used today.`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
