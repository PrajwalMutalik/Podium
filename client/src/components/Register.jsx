import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Correct the environment variable name
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { name, email, password } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post(`${VITE_API_BASE_URL}/api/auth/register`, { name, email, password });
      setMessage('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error(err.response.data);
      setMessage(err.response.data.msg || 'Registration failed');
    }
  };

  return (
    <div className="glass-container" style={{ maxWidth: '450px', margin: '4rem auto' }}>
      <h1>Create Account</h1>
      <form onSubmit={onSubmit}>
        <input type="text" name="name" value={name} onChange={onChange} placeholder="Name" required />
        <input type="email" name="email" value={email} onChange={onChange} placeholder="Email Address" required />
        <input type="password" name="password" value={password} onChange={onChange} placeholder="Password (min. 6 characters)" minLength="6" required />
        <button type="submit">Register</button>
      </form>
      {message && (
        <div style={{
          marginTop: '1.5rem',
          padding: '0.75rem',
          backgroundColor: message.includes('successful') ? '#34d399' : '#ef4444',
          color: 'white',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}
      <p style={{marginTop: '1.5rem', fontSize: '0.9rem'}}>Already have an account? <Link to="/login" style={{color: 'var(--accent-color)'}}>Login</Link></p>
    </div>
  );
};

export default Register;
