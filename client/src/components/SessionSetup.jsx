import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SessionSetup.css';
import './DailyQuotaPopup.css';
import { useQuota } from '../context/QuotaContext';
import { BASE_URL } from '../config/api';

const rolesAndCategories = {
  'SDE': [
    'All', 'Data Structures & Algorithms', 'OOP', 'DBMS',
    'Operating Systems', 'Computer Networks', 'System Design',
    'Frontend', 'Backend', 'Cloud', 'Behavioral'
  ],
  'Frontend Developer': ['All', 'HTML/CSS', 'JavaScript', 'React', 'Behavioral'],
  'Backend Developer': ['All', 'APIs', 'Databases', 'System Design', 'Behavioral'],
  'Cloud Engineer': ['All', 'AWS', 'Azure', 'GCP', 'DevOps', 'Behavioral']
};

const roleIcons = {
  'SDE': '💻',
  'Frontend Developer': '🎨',
  'Backend Developer': '⚙️',
  'Cloud Engineer': '☁️'
};

const SessionSetup = () => {
  const [role, setRole] = useState('SDE');
  const [category, setCategory] = useState('All');
  const [categoriesForRole, setCategoriesForRole] = useState(rolesAndCategories['SDE']);
  const { showQuotaPopup } = useQuota();
  const navigate = useNavigate();

  useEffect(() => {
    setCategoriesForRole(rolesAndCategories[role]);
    setCategory('All');
  }, [role]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const baseUrl = BASE_URL;
      const res = await fetch(`${baseUrl}/api/interview/check-quota`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });

      if (!res.ok) throw new Error(`Server status: ${res.status}`);
      const data = await res.json();

      if (data.quotaReached) {
        showQuotaPopup();
      } else {
        navigate(`/interview-room?role=${role}&category=${encodeURIComponent(category)}`);
      }
    } catch (err) {
      console.error("Failed to check quota:", err);
      showQuotaPopup();
    }
  };

  return (
    <div className="session-setup-container">
      <div className="glass-container setup-card">
        <div className="setup-header">
          <h1>Configure Session</h1>
          <p>Choose your target role and topic to simulate a real interview.</p>
        </div>

        {/* ROLE SELECTION */}
        <div className="selection-section">
          <span className="selection-title">Target Role</span>
          <div className="bento-grid">
            {Object.keys(rolesAndCategories).map((r) => (
              <div
                key={r}
                className={`selection-card ${role === r ? 'selected' : ''}`}
                onClick={() => setRole(r)}
              >
                <span className="card-icon">{roleIcons[r] || '💼'}</span>
                <span className="card-label">{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CATEGORY SELECTION */}
        <div className="selection-section">
          <span className="selection-title">Focus Area</span>
          <div className="bento-grid">
            {categoriesForRole.map((cat) => (
              <div
                key={cat}
                className={`selection-card ${category === cat ? 'selected' : ''}`}
                onClick={() => setCategory(cat)}
              >
                <span className="card-label" style={{ fontSize: '0.95rem' }}>{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* START BUTTON */}
        <div className="action-wrapper">
          <button className="btn btn-primary start-session-btn" onClick={handleSubmit}>
            <span className="btn-icon">🚀</span>
            Start Practice Session
          </button>
        </div>
      </div>

      {/* RESOURCE LINK */}
      <div className="glass-container resource-teaser" onClick={() => window.open("https://drive.google.com/drive/folders/1fHNvNDuURUfYgP2bboYQBlpqOGtfoiRR", "_blank")}>
        <div className="teaser-content">
          <h3>Need Study Materials?</h3>
          <p>Access our curated "CS Fundamentals Pack" with notes on OS, DBMS, and more.</p>
        </div>
        <span className="download-link">Open Drive ↗</span>
      </div>
    </div>
  );
};

export default SessionSetup;
