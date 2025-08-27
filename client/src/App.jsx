import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useQuota } from './context/QuotaContext';
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
import ThemeSwitch from './components/ThemeSwitch';
import Leaderboard from './components/Leaderboard';
// Note: The QuotaProvider is now imported in your main.jsx or equivalent entry file
// where it can wrap the entire App.

function App() {
  // This component now assumes it is rendered inside a Router, AuthProvider, and QuotaProvider
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

// --- HELPER COMPONENTS ---

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(160, 82, 45, 0.1)" />
    <path d="M9 10V14" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 8V16" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 11V13" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(160, 82, 45, 0.3)" strokeWidth="0.5" strokeDasharray="2 2" />
  </svg>
);

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { quota, fetchQuota } = useQuota();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchQuota();
    }
  }, [isAuthenticated, fetchQuota]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="logo-link">
          <Logo />
          <span>Podium</span>
        </Link>
        <ThemeSwitch />
      </div>
      <div className="nav-link-group">
        {isAuthenticated ? (
          <>
            <button onClick={() => navigate('/dashboard')} className="nav-item-button">Dashboard</button>
            <button onClick={() => navigate('/practice')} className="nav-item-button">Practice</button>
            <button onClick={() => navigate('/history')} className="nav-item-button">History</button>
            <button onClick={() => navigate('/leaderboard')} className="nav-item-button">Leaderboard</button>
            <button onClick={() => navigate('/settings')} className="nav-item-button">Settings</button>
            <button onClick={() => navigate('/about')} className="nav-item-button">About Us</button>
            <button onClick={() => navigate('/contact')} className="nav-item-button">Contact</button>
          </>
        ) : (
          <>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </>
        )}
      </div>
      <div className="navbar-right-section">
        {isAuthenticated && (
          <div className="daily-limit-display">
            <span>
              Daily Limit: {quota.currentUsage} / {quota.dailyLimit}
            </span>
          </div>
        )}
        {isAuthenticated ? (
          <button onClick={handleLogout} className="nav-button">Logout</button>
        ) : (
          <div className="auth-links">
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const WelcomePage = () => (
  <div className="glass-container" style={{maxWidth: '600px', margin: '5rem auto', textAlign: 'center'}}>
    <h1>Welcome to Podium</h1>
    <p>Your personal AI-powered interview coach. Sharpen your skills, get instant feedback, and land your dream job. Please register or log in to begin.</p>
  </div>
);

const Footer = () => (
    <footer className="footer">
        <p>Developed by Prajwal</p>
        <p>&copy; {new Date().getFullYear()} Podium. All Rights Reserved.</p>
    </footer>
);

export default App;
