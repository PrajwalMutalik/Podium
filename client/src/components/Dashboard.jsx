import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth
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
  const { userProfile } = useAuth(); 
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
        const res = await axios.get('/api/sessions', {
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
      <h1>Your Dashboard</h1>
      <div className="stats-grid">
        {/* Gamification Stats are now read from userProfile */}
        <div className="stat-card glass-container">
          <h3>Total Points</h3>
          <p>{userProfile.points} XP</p>
        </div>
        <div className="stat-card glass-container">
          <h3>Practice Streak</h3>
          <p>{userProfile.currentStreak} Days 🔥</p>
        </div>
        {/* Existing Stats */}
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

      {/* Badges Section now reads from userProfile */}
      <div className="badges-section glass-container">
        <h2>Your Badges</h2>
        {userProfile.badges && userProfile.badges.length > 0 ? (
          <div className="badges-grid">
            {userProfile.badges.map(badgeName => (
              <Badge key={badgeName} name={badgeName} />
            ))}
          </div>
        ) : (
          <p>Complete a session to earn your first badge!</p>
        )}
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
        <div className="action-card glass-container" onClick={() => navigate('/leaderboard')}>
          <h2>View Leaderboard</h2>
          <p>See how you stack up against other top performers.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
