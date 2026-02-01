import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../config/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });

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
    <div className="glass-container fade-in" style={{ maxWidth: '450px', margin: '4rem auto', padding: '3rem 2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h1>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <input type="email" name="email" value={email} onChange={onChange} placeholder="Email Address" required />
        <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Login</button>
      </form>
      <p style={{ marginTop: '2rem', fontSize: '0.95rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Register</Link>
      </p>
    </div>
  );
};

export default Login;
