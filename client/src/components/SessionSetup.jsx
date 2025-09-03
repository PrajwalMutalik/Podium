import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HistoryPage.css';
import './DailyQuotaPopup.css';
import { useQuota } from '../context/QuotaContext';

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

const SessionSetup = () => {
  const [role, setRole] = useState('SDE');
  const [category, setCategory] = useState('All');
  const [categoriesForRole, setCategoriesForRole] = useState(rolesAndCategories['SDE']);
  const [isPracticeExpanded, setIsPracticeExpanded] = useState(false);
  const [isResourceCardExpanded, setIsResourceCardExpanded] = useState(false);
  const { showQuotaPopup } = useQuota();
  const navigate = useNavigate();

  useEffect(() => {
    setCategoriesForRole(rolesAndCategories[role]);
    setCategory('All');
  }, [role]);

  // This is the corrected API call handler.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // If there's no token, the user isn't logged in.
        // You might want to navigate them to the login page.
        navigate('/login');
        return;
      }

      const res = await fetch('/api/interview/check-quota', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, // Ensure the token is sent
        },
      });

      if (!res.ok) {
        // This handles server errors (e.g., 500)
        throw new Error(`Server responded with status: ${res.status}`);
      }

      const data = await res.json();

      // This is the key logic:
      // If the server says the quota is reached, show the popup.
      if (data.quotaReached) {
        showQuotaPopup();
      } else {
        // Otherwise, navigate to the interview room.
        navigate(`/interview-room?role=${role}&category=${encodeURIComponent(category)}`);
      }
    } catch (err) {
      console.error("Failed to check quota:", err);
      // Show the popup as a fallback if the API call fails for any reason.
      showQuotaPopup();
    }
  };

  const csTopics = [
    'Operating Systems (OS)',
    'Object-Oriented Programming (OOPS)', 
    'Computer Networks',
    'Database Management Systems (DBMS)',
    'Data Structures and Algorithms (DSA)',
    'Computer Organization (CO)',
    'SQL',
    'General Interview Prep'
  ];

  return (
    <div className="session-setup-container">
      <div
        className={`glass-container ${!isPracticeExpanded ? 'clickable' : ''}`}
        onClick={() => setIsPracticeExpanded(!isPracticeExpanded)}
      >
        <div className="resource-header">
          <h1>Practice Interview Session</h1>
        </div>
        {isPracticeExpanded && (
          <>
            <p>Customize your practice interview by selecting your target role and question category.</p>
            <form onSubmit={(e) => { e.stopPropagation(); handleSubmit(e); }} className="setup-form">
              <div className="form-group" onClick={(e) => e.stopPropagation()}>
                <label htmlFor="role">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Choose Your Role
                </label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                  {Object.keys(rolesAndCategories).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" onClick={(e) => e.stopPropagation()}>
                <label htmlFor="category">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Question Category
                </label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categoriesForRole.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="start-button" onClick={(e) => e.stopPropagation()}>
                Begin Practice Session
              </button>
            </form>
          </>
        )}
      </div>

      <div
        className={`glass-container resource-card ${!isResourceCardExpanded ? 'clickable' : ''}`}
        onClick={() => setIsResourceCardExpanded(!isResourceCardExpanded)}
      >
        <div className="resource-header">
          <h2>CS Fundamentals Resource Pack</h2>
        </div>
        {isResourceCardExpanded && (
          <>
            <p>Enhance your interview preparation with our comprehensive study materials</p>
            <div className="topics-container">
              {csTopics.map((topic, index) => (
                <div key={index} className="topic-item">{topic}</div>
              ))}
            </div>
            <a href="https://drive.google.com/drive/folders/1fHNvNDuURUfYgP2bboYQBlpqOGtfoiRR" target="_blank" rel="noopener noreferrer" className="download-button" onClick={(e) => e.stopPropagation()}>
              Download Resources
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default SessionSetup;
