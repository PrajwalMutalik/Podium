import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { BASE_URL } from '../config/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const { name, email, password } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/register`, { name, email, password });
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error(err.response.data);
      alert(err.response.data.msg || 'Registration failed');
    }
  };

  return (
    <div className="glass-container fade-in" style={{ maxWidth: '450px', margin: '4rem auto', padding: '3rem 2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h1>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <input type="text" name="name" value={name} onChange={onChange} placeholder="Name" required />
        <input type="email" name="email" value={email} onChange={onChange} placeholder="Email Address" required />
        <input type="password" name="password" value={password} onChange={onChange} placeholder="Password (min. 6 characters)" minLength="6" required />
        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Register</button>
      </form>
      <p style={{ marginTop: '2rem', fontSize: '0.95rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Login</Link>
      </p>
    </div>
  );
};

export default Register;