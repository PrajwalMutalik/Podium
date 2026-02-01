import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config/api';
import Spinner from './Spinner';
import './HistoryPage.css';

const HistoryPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BASE_URL}/api/sessions`, {
          headers: { 'x-auth-token': token },
        });
        // Sort by date desc
        const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setSessions(sorted);
      } catch (error) {
        console.error('Error fetching session history:', error);
      }
      setLoading(false);
    };
    fetchSessions();
  }, []);

  const handleDelete = async (e, sessionId) => {
    e.stopPropagation(); // Prevent toggling accordion
    if (!window.confirm('Delete this session record permanently?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/sessions/${sessionId}`, {
        headers: { 'x-auth-token': token },
      });
      setSessions(sessions.filter((s) => s._id !== sessionId));
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Failed to delete session.');
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <Spinner text="Loading your history..." />;

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>Session History</h1>
        <p>Review your performance and track your growth over time.</p>
      </div>

      <div className="sessions-list">
        {sessions.length === 0 ? (
          <div className="empty-history">
            <h3>No sessions recorded yet</h3>
            <p>Complete your first practice interview to see it here!</p>
          </div>
        ) : (
          sessions.map((session) => {
            // Determine status class based on WPM (simple logic for demo)
            const statusClass = session.wpm > 120 && session.wpm < 180 ? 'good' : 'avg';
            const isExpanded = expandedId === session._id;

            return (
              <div
                key={session._id}
                className={`session-card ${statusClass}`}
              >
                <div className="card-header-row">
                  <div className="session-date">
                    <span>📅 {new Date(session.date).toLocaleDateString()}</span>
                    <span>• {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDelete(e, session._id)}
                    title="Delete Session"
                  >
                    🗑️ Delete
                  </button>
                </div>

                <div className="session-question">
                  "{session.questionText}"
                </div>

                <div className="card-metrics">
                  <div className="metric-item">
                    <span className="metric-label">Pace</span>
                    <span className="metric-value">{session.wpm} <small>WPM</small></span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Fillers</span>
                    <span className="metric-value">{session.fillerWordCount}</span>
                  </div>
                </div>

                <div className="feedback-accordion">
                  <div
                    className="accordion-toggle"
                    onClick={() => toggleExpand(session._id)}
                  >
                    {isExpanded ? 'Hide Analysis ▲' : 'View AI Analysis ▼'}
                  </div>

                  {isExpanded && (
                    <div className="accordion-content">
                      <div className="feedback-block">
                        <h4>🤖 AI Feedback</h4>
                        <p>{session.feedback || "No feedback available."}</p>
                      </div>

                      {session.improvements && (
                        <div className="feedback-block">
                          <h4>📈 Areas to Improve</h4>
                          <p>{session.improvements}</p>
                        </div>
                      )}

                      <div className="feedback-block">
                        <h4>📝 Transcript</h4>
                        <p style={{ fontStyle: 'italic', opacity: 0.8 }}>
                          "{session.transcript || 'No transcript available.'}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
