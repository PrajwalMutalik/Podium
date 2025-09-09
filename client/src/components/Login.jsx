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
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, { email, password });
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response.data);
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
