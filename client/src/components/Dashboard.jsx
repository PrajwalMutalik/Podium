import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
import './Dashboard.css'; 

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSessions: 0,
    avgWpm: 0,
    avgFillers: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/api/sessions', {
          headers: { 'x-auth-token': token },
        });
        
        const sessions = res.data;
        if (sessions.length > 0) {
          const totalWpm = sessions.reduce((sum, s) => sum + s.wpm, 0);
          const totalFillers = sessions.reduce((sum, s) => sum + s.fillerWordCount, 0);
          setStats({
            totalSessions: sessions.length,
            avgWpm: Math.round(totalWpm / sessions.length),
            avgFillers: (totalFillers / sessions.length).toFixed(1),
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return <Spinner text="Loading Dashboard..." />;
  }

  return (
    <div className="dashboard-container">
      <h1>Your Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card glass-container">
          <h3>Total Sessions</h3>
          <p>{stats.totalSessions}</p>
        </div>
        <div className="stat-card glass-container">
          <h3>Average Pace</h3>
          <p>{stats.avgWpm} WPM</p>
        </div>
        <div className="stat-card glass-container">
          <h3>Avg. Filler Words</h3>
          <p>{stats.avgFillers}</p>
        </div>
      </div>
      <div className="actions-grid">
        <div className="action-card glass-container" onClick={() => navigate('/practice')}>
          <h2>Start New Session</h2>
          <p>Begin a new practice interview with a random question.</p>
        </div>
        <div className="action-card glass-container" onClick={() => navigate('/history')}>
          <h2>View Full History</h2>
          <p>Review detailed feedback from all your past sessions.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
