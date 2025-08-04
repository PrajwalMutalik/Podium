import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HistoryPage.css';

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
  const navigate = useNavigate();

  useEffect(() => {
    setCategoriesForRole(rolesAndCategories[role]);
    setCategory('All');
  }, [role]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/interview-room?role=${role}&category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="glass-container">
      <h1>Practice Session Setup</h1>
      <p>Choose your preferences to get a targeted interview question.</p>
      <form onSubmit={handleSubmit} className="setup-form">
        <div className="form-group">
          <label htmlFor="role">Select Your Role:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            {Object.keys(rolesAndCategories).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="category">Select Question Category:</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categoriesForRole.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="start-button">Start Practice</button>
      </form>
    </div>
  );
};

export default SessionSetup;
