import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- MOCK COMPONENTS & STYLES FOR PREVIEW ---
// These are included to make the component runnable and resolve import errors.

const Spinner = ({ text }) => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <p>{text || 'Loading...'}</p>
  </div>
);

// CSS is injected directly for preview purposes
const LeaderboardStyles = `
  .leaderboard-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
    text-align: center;
  }
  .leaderboard-container h1 {
    font-size: 2.5rem;
    color: var(--accent-color, #A0522D);
    margin-bottom: 0.5rem;
  }
  .leaderboard-container p {
    color: var(--secondary-text, #666);
    margin-bottom: 2rem;
  }
  .leaderboard-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .leaderboard-item {
    display: grid;
    grid-template-columns: 50px 1fr auto;
    align-items: center;
    gap: 1.5rem;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    text-align: left;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    animation: slideIn 0.5s ease-out forwards;
    opacity: 0;
  }
  .leaderboard-item:nth-child(1) { animation-delay: 0.1s; }
  .leaderboard-item:nth-child(2) { animation-delay: 0.2s; }
  .leaderboard-item:nth-child(3) { animation-delay: 0.3s; }
  .leaderboard-item:nth-child(4) { animation-delay: 0.4s; }
  .leaderboard-item:nth-child(5) { animation-delay: 0.5s; }
  .leaderboard-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  .rank {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--accent-color, #A0522D);
    text-align: center;
  }
  .user-name {
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--primary-text, #333);
  }
  .user-points {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--accent-color, #A0522D);
    background-color: rgba(160, 82, 45, 0.1);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
  }
  .glass-container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

// Helper to assign medal icons to top ranks
const getRankIcon = (rank) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
        const res = await axios.get(`${baseUrl}/api/leaderboard`, {
          headers: { 'x-auth-token': token },
        });
        setLeaderboard(res.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLeaderboard([]); // Empty array instead of mock data
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return <Spinner text="Loading Leaderboard..." />;
  }

  return (
    <>
      <style>{LeaderboardStyles}</style>
      <div className="leaderboard-container">
        <h1>Top Performers</h1>
        <p>See who's leading the pack. Keep practicing to climb the ranks!</p>
        <div className="leaderboard-list">
          {leaderboard.map((user, index) => (
            <div key={user._id} className="leaderboard-item glass-container">
              <div className="rank">{getRankIcon(index + 1)}</div>
              <div className="user-name">{user.name}</div>
              <div className="user-points">{user.points} XP</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
