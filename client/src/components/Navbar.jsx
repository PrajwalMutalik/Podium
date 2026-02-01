import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuota } from '../context/QuotaContext';
import ThemeSwitch from './ThemeSwitch';

const Logo = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-icon">
        <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(160, 82, 45, 0.1)" />
        <path d="M9 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 11V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const { quota, fetchQuota } = useQuota();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isAuthenticated) {
            fetchQuota();
        }
    }, [isAuthenticated, fetchQuota]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to={isAuthenticated ? "/dashboard" : "/"} className="logo-link">
                    <Logo />
                    <span>Podium</span>
                </Link>

                <div className="nav-links">
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>Dashboard</Link>
                            <Link to="/practice" className={`nav-link ${isActive('/practice')}`}>Practice</Link>
                            <Link to="/history" className={`nav-link ${isActive('/history')}`}>History</Link>
                            <Link to="/leaderboard" className={`nav-link ${isActive('/leaderboard')}`}>Leaderboard</Link>
                            <Link to="/settings" className={`nav-link ${isActive('/settings')}`}>Settings</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/about" className={`nav-link ${isActive('/about')}`}>About</Link>
                            <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>Contact</Link>
                        </>
                    )}
                </div>

                <div className="nav-actions">
                    <ThemeSwitch />

                    {isAuthenticated && (
                        <div className="daily-limit-display" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Quota: {quota.currentUsage} / {quota.dailyLimit}
                        </div>
                    )}

                    {isAuthenticated ? (
                        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                            Logout
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <Link to="/login" className="btn btn-outline">Login</Link>
                            <Link to="/register" className="btn btn-primary">Get Started</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
