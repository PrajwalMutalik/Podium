import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import AnimatedPage from './components/AnimatedPage';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SessionSetup from './components/SessionSetup';
import InterviewRoom from './components/InterviewRoom';
import HistoryPage from './components/HistoryPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import SettingsPage from './components/SettingsPage';
import Leaderboard from './components/Leaderboard';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<AnimatedPage><WelcomePage /></AnimatedPage>} />
          <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
          <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
          <Route path="/about" element={<AnimatedPage><AboutPage /></AnimatedPage>} />
          <Route path="/contact" element={<AnimatedPage><ContactPage /></AnimatedPage>} />
          <Route path="/dashboard" element={<PrivateRoute><AnimatedPage><Dashboard /></AnimatedPage></PrivateRoute>} />
          <Route path="/practice" element={<PrivateRoute><AnimatedPage><SessionSetup /></AnimatedPage></PrivateRoute>} />
          <Route path="/interview-room" element={<PrivateRoute><AnimatedPage><InterviewRoom /></AnimatedPage></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><AnimatedPage><HistoryPage /></AnimatedPage></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><AnimatedPage><SettingsPage /></AnimatedPage></PrivateRoute>} />
          <Route path="/leaderboard" element={<PrivateRoute><AnimatedPage><Leaderboard /></AnimatedPage></PrivateRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

const WelcomePage = () => (
  <div className="glass-container fade-in" style={{ maxWidth: '800px', margin: '4rem auto', textAlign: 'center', padding: '4rem 2rem' }}>
    <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
      Master Your Interview Skills
    </h1>
    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
      Your personal AI-powered coach. Get real-time feedback, track your progress, and land your dream job.
    </p>
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
      <a href="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>Start Practice</a>
      <a href="/about" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>Learn More</a>
    </div>
  </div>
);

const Footer = () => (
  <footer style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', borderTop: '1px solid var(--card-border)', marginTop: 'auto' }}>
    <p>&copy; {new Date().getFullYear()} Podium. All Rights Reserved.</p>
  </footer>
);

export default App;
