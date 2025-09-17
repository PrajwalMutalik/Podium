import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, ''); // Remove trailing slash if present
      const res = await axios.post(`${baseUrl}/api/auth/login`, { email, password });
      
      if (res.data && res.data.token) {
        login(res.data.token);
        navigate('/dashboard');
      } else {
        alert('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        alert(err.response.data.msg || 'Login failed');
      } else if (err.request) {
        alert('Cannot connect to server. Please check your internet connection.');
      } else {
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="glass-container" style={{ maxWidth: '450px', margin: '4rem auto' }}>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <input type="email" name="email" value={email} onChange={onChange} placeholder="Email Address" required />
        <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p style={{marginTop: '1.5rem', fontSize: '0.9rem'}}>Don't have an account? <Link to="/register" style={{color: 'var(--accent-color)'}}>Register</Link></p>
    </div>
  );
};

export default Login;
