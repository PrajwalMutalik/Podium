import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth
import { useQuota } from '../context/QuotaContext';
import Spinner from './Spinner';
import './Dashboard.css';

// A simple component for displaying badges with tooltips
const Badge = ({ name }) => {
  const badgeDetails = {
    FirstStep: { icon: '👟', description: 'Completed your first session!' },
    Speedster: { icon: '🚀', description: 'Spoke faster than 180 WPM.' },
    Eloquent: { icon: '🎤', description: 'Used zero filler words in a session.' },
    WeekStreak: { icon: '🔥', description: 'Maintained a 7-day practice streak.' },
  };

  const detail = badgeDetails[name] || { icon: '⭐', description: 'An awesome achievement!' };

  return (
    <div className="badge" title={detail.description}>
      <span className="badge-icon">{detail.icon}</span>
      <span className="badge-name">{name}</span>
    </div>
  );
};

const Dashboard = () => {
  // 2. Get userProfile from the AuthContext
  const { userProfile, userApiKey } = useAuth(); 
  const { quota, isLoading: quotaLoading } = useQuota();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalSessions: 0,
    avgWpm: 0,
    avgFillers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This useEffect now only fetches session data. Profile data comes from the context.
    const fetchSessionStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
        const res = await axios.get(`${baseUrl}/api/sessions`, {
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
        console.error('Error fetching session stats:', error);
      }
      // We only stop loading once the session stats are also fetched.
      setLoading(false);
    };

    if (userProfile) { // Only fetch session stats if the user profile is loaded
        fetchSessionStats();
    }
  }, [userProfile]); // Re-run if userProfile changes

  // 3. The main loading condition now depends on userProfile from the context.
  if (!userProfile || loading) {
    return <Spinner text="Loading Dashboard..." />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome Back!</h1>
        <p>Track your progress and continue improving your interview skills</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card glass-container">
          <h3>Total Points</h3>
          <p>{userProfile.points}</p>
          <div className="stat-subtitle">XP Earned</div>
        </div>
        <div className="stat-card glass-container">
          <h3>Practice Streak</h3>
          <p>{userProfile.currentStreak} <span role="img" aria-label="fire">🔥</span></p>
          <div className="stat-subtitle">Days in a Row</div>
        </div>
        <div className="stat-card glass-container">
          <h3>Daily Usage</h3>
          {quotaLoading ? (
            <p>Loading...</p>
          ) : userApiKey ? (
            <p><span role="img" aria-label="unlimited">♾️</span></p>
          ) : (
            <p>{quota.currentUsage}/{quota.dailyLimit}</p>
          )}
          <div className="stat-subtitle">Available Sessions</div>
        </div>
        <div className="stat-card glass-container">
          <h3>Total Sessions</h3>
          <p>{stats.totalSessions}</p>
          <div className="stat-subtitle">Interviews Completed</div>
        </div>
        <div className="stat-card glass-container">
          <h3>Average Pace</h3>
          <p>{stats.avgWpm}</p>
          <div className="stat-subtitle">Words per Minute</div>
        </div>
        <div className="stat-card glass-container">
          <h3>Filler Words</h3>
          <p>{stats.avgFillers}</p>
          <div className="stat-subtitle">Average per Session</div>
        </div>
      </div>

      <div className="badges-section glass-container">
        <h2>Your Achievements</h2>
        {userProfile.badges && userProfile.badges.length > 0 ? (
          <div className="badges-grid">
            {userProfile.badges.map(badgeName => (
              <Badge key={badgeName} name={badgeName} />
            ))}
          </div>
        ) : (
          <p className="empty-badges">Complete your first session to earn badges! 🏆</p>
        )}
      </div>

      <div className="actions-grid">
        <div className="action-card glass-container" onClick={() => navigate('/practice')}>
          <span className="action-card-icon">🎯</span>
          <h2>Start Practice</h2>
          <p>Begin a new interview session with AI-powered feedback</p>
        </div>
        <div className="action-card glass-container" onClick={() => navigate('/history')}>
          <span className="action-card-icon">📊</span>
          <h2>View History</h2>
          <p>Review your past sessions and track your improvement</p>
        </div>
        <div className="action-card glass-container" onClick={() => navigate('/leaderboard')}>
          <span className="action-card-icon">🏆</span>
          <h2>Leaderboard</h2>
          <p>Compare your progress with other top performers</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
