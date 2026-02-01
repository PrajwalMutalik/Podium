import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuota } from '../context/QuotaContext';
import { BASE_URL } from '../config/api';
import Spinner from './Spinner';
import './Dashboard.css';

const Badge = ({ name }) => {
  const badgeDetails = {
    FirstStep: { icon: '👟', description: 'Completed your first session!' },
    Speedster: { icon: '🚀', description: 'Spoke faster than 180 WPM.' },
    Eloquent: { icon: '🎤', description: 'Used zero filler words in a session.' },
    WeekStreak: { icon: '🔥', description: 'Maintained a 7-day practice streak.' },
  };

  const detail = badgeDetails[name] || { icon: '⭐', description: 'An awesome achievement!' };

  return (
    <div className="badge-card" title={detail.description}>
      <div className="badge-icon-wrapper">{detail.icon}</div>
      <span className="badge-name">{name}</span>
    </div>
  );
};

const Dashboard = () => {
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
    const fetchSessionStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BASE_URL}/api/sessions`, {
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
      setLoading(false);
    };

    if (userProfile) {
      fetchSessionStats();
    }
  }, [userProfile]);

  if (!userProfile || loading) {
    return <Spinner text="Loading Dashboard..." />;
  }

  return (
    <div className="dashboard-container">
      {/* HERO WELCOME SECTION */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1>Hello, {userProfile.name.split(' ')[0]}! 👋</h1>
          <p>Ready to master your next interview?</p>
        </div>
        <div className="hero-action">
          <button className="btn btn-primary start-btn" onClick={() => navigate('/practice')}>
            Start New Session
          </button>
        </div>
      </div>

      {/* MAIN STATS GRID */}
      <div className="stats-overview">
        <div className="stat-tile glass-container">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <h3>XP Earned</h3>
            <p className="stat-value">{userProfile.points}</p>
          </div>
        </div>

        <div className="stat-tile glass-container">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <h3>Day Streak</h3>
            <p className="stat-value">{userProfile.currentStreak}</p>
          </div>
        </div>

        <div className="stat-tile glass-container">
          <div className="stat-icon">🎫</div>
          <div className="stat-info">
            <h3>Daily Quota</h3>
            {quotaLoading ? (
              <p className="stat-value">...</p>
            ) : userApiKey ? (
              <p className="stat-value">∞</p>
            ) : (
              <p className="stat-value">{quota.currentUsage} <span className="stat-max">/ {quota.dailyLimit}</span></p>
            )}
          </div>
        </div>

        <div className="stat-tile glass-container">
          <div className="stat-icon">🎤</div>
          <div className="stat-info">
            <h3>Sessions</h3>
            <p className="stat-value">{stats.totalSessions}</p>
          </div>
        </div>
      </div>

      {/* CONTENT SPLIT: ACHIEVEMENTS & QUICK ACTIONS */}
      <div className="dashboard-split">
        {/* LEFT: ACHIEVEMENTS */}
        <div className="section-container glass-container">
          <div className="section-header">
            <h2>Recent Achievements</h2>
            <span className="view-all" onClick={() => navigate('/profile')}>View All</span>
          </div>

          {userProfile.badges && userProfile.badges.length > 0 ? (
            <div className="badges-scroll">
              {userProfile.badges.map(badgeName => (
                <Badge key={badgeName} name={badgeName} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</span>
              <p>Complete your first session to earn badges!</p>
            </div>
          )}
        </div>

        {/* RIGHT: TOOLS/ACTIONS */}
        <div className="section-container glass-container">
          <div className="section-header">
            <h2>Quick Tools</h2>
          </div>
          <div className="quick-actions-list">
            <div className="tool-item" onClick={() => navigate('/history')}>
              <span className="tool-icon">📊</span>
              <div className="tool-details">
                <h4>Performance History</h4>
                <p>Analyze your progress over time</p>
              </div>
              <span className="arrow">→</span>
            </div>

            <div className="tool-item" onClick={() => navigate('/leaderboard')}>
              <span className="tool-icon">🌍</span>
              <div className="tool-details">
                <h4>Global Leaderboard</h4>
                <p>See where you stand among others</p>
              </div>
              <span className="arrow">→</span>
            </div>

            <div className="tool-item" onClick={() => navigate('/settings')}>
              <span className="tool-icon">⚙️</span>
              <div className="tool-details">
                <h4>Settings & API Key</h4>
                <p>Manage your account preferences</p>
              </div>
              <span className="arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
