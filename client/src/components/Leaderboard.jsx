import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState(''); // State for the message
  const { login } = useAuth();
  const navigate = useNavigate();

  // Use the environment variable for the backend URL
  const VITE_BACKEND_URL = import.meta.env.VITE_VITE_BACKEND_URL;

  const { email, password } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    try {
      // Use the VITE_BACKEND_URL variable to make the API call
      const res = await axios.post(`${VITE_BACKEND_URL}/api/auth/login`, { email, password });
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response.data);
      setMessage(err.response.data.msg || 'Login failed'); // Set the error message
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
      {message && (
        <div style={{
          marginTop: '1.5rem',
          padding: '0.75rem',
          backgroundColor: '#ef4444',
          color: 'white',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}
      <p style={{marginTop: '1.5rem', fontSize: '0.9rem'}}>Don't have an account? <Link to="/register" style={{color: 'var(--accent-color)'}}>Register</Link></p>
    </div>
  );
};

export default Login;
