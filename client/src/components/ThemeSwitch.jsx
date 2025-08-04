import { useState, useEffect } from 'react';

const ThemeSwitch = () => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else if (prefersDark) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    // Update theme when isDark changes
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className="theme-switch-wrapper">
      <label className="theme-switch">
        <input 
          type="checkbox" 
          checked={isDark}
          onChange={toggleTheme}
        />
        <span className="slider">
          <span className="slider-icon sun">☀️</span>
          <span className="slider-icon moon">🦉</span>
        </span>
      </label>
    </div>
  );
};

export default ThemeSwitch;
