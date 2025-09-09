import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HistoryPage.css';

const HistoryPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Correct variable name
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BACKEND_URL}/api/sessions`, {
          headers: { 'x-auth-token': token },
        });

        // Ensure the response is an array before setting the state
        if (Array.isArray(res.data)) {
          setSessions(res.data);
        } else {
          setSessions([]); // Set to an empty array if the response is not valid
        }
      } catch (error) {
        console.error('Error fetching session history:', error);
        setSessions([]); // Set to an empty array on error
      }
      setLoading(false);
    };
    fetchSessions();
  }, [BACKEND_URL]);

  const handleDelete = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${BACKEND_URL}/api/sessions/${sessionId}`, {
          headers: { 'x-auth-token': token },
        });
        setSessions(sessions.filter((session) => session._id !== sessionId));
      } catch (error) {
        console.error('Error deleting session:', error);
        console.error('Failed to delete session.');
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
                <div className="details-content">
                  <h4>AI Coach Feedback:</h4>
                  <p>{session.aiFeedback}</p>
                  <h4>Your Transcript:</h4>
                  <p>{session.transcript}</p>
                </div>
              </details>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
