import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { userApiKey, saveUserApiKey } = useAuth();
  const [apiKey, setApiKey] = useState(userApiKey || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    saveUserApiKey(apiKey);
    alert('API Key saved successfully!');
  };

  return (
    <div className="glass-container">
      <h1>API Key Settings</h1>
      <p>
        To avoid using the site's shared API quota, you can provide your own Google Gemini API key here. 
        Your key is saved only in your browser's local storage and is never stored on our servers.
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
        <button type="submit">Save Key</button>
      </form>
    </div>
  );
};

export default SettingsPage;
