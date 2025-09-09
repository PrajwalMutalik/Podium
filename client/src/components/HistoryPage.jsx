import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HistoryPage.css';

const HistoryPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/sessions`, {
          headers: { 'x-auth-token': token },
        });
        setSessions(res.data);
      } catch (error) {
        console.error('Error fetching session history:', error);
      }
      setLoading(false);
    };
    fetchSessions();
  }, []);

  const handleDelete = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/sessions/${sessionId}`, {
          headers: { 'x-auth-token': token },
        });
        setSessions(sessions.filter((session) => session._id !== sessionId));
      } catch (error) {
        console.error('Error deleting session:', error);
        alert('Failed to delete session.');
      }
    }
  };

  if (loading) {
    return <div className="loading-text">Loading History...</div>;
  }

  return (
    <div className="glass-container">
      <h1>Your Progress</h1>
      <p>Review your past interview sessions to track your improvement.</p>
      <div className="sessions-list">
        {sessions.length === 0 ? (
          <p>You have no saved sessions yet. Go practice!</p>
        ) : (
          sessions.map((session) => (
            <div key={session._id} className="session-card">
              <div className="session-header">
                <h3>{new Date(session.date).toLocaleDateString()}</h3>
                <div className="session-metrics">
                  <span>{session.wpm} WPM</span>
                  <span>{session.fillerWordCount} Fillers</span>
                  <button onClick={() => handleDelete(session._id)} className="delete-button">
                    Delete
                  </button>
                </div>
              </div>
              <p className="question-prompt">
                <strong>Q:</strong> {session.questionText}
              </p>
              <details className="feedback-details">
                <summary>Show Feedback & Transcript</summary>
                {/* vvv THIS IS THE CORRECTED SECTION vvv */}
                <div className="details-content">
                  <h4>AI Coach Feedback:</h4>
                  <p>{session.aiFeedback}</p>
                  <h4>Your Transcript:</h4>
                  <p>{session.transcript}</p>
                </div>
                {/* ^^^ END OF CORRECTED SECTION ^^^ */}
              </details>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
