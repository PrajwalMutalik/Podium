import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  // Use the environment variable for the backend URL
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const { email, password } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the BACKEND_URL variable to make the API call
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, { email, password });
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response.data);
      // NOTE: Using a custom modal or message box is recommended instead of alert()
      alert(err.response.data.msg || 'Login failed');
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
