import React from 'react';
import { useNavigate } from 'react-router-dom';

const DailyQuotaPopup = ({ onClose }) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    // Navigate to the settings/upgrade page when the button is clicked
    navigate('/settings'); 
  };

  return (
    <div className="quota-popup-overlay">
      <div className="quota-popup-card glass-container">
        <h2>Daily Limit Reached</h2>
        <p>
          You’ve used all 15 of your free practice questions for today.
        </p>
        <p>
          To continue practicing, you can provide your own API key in the settings.
        </p>
        <div className="popup-buttons">
          <button onClick={handleUpgrade} className="upgrade-button">
            Go to Settings
          </button>
          <button onClick={onClose} className="secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyQuotaPopup;
