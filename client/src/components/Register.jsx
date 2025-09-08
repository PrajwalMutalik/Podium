import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const { name, email, password } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Use the environment variable for the backend URL
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the BACKEND_URL variable to make the API call
      await axios.post(`${BACKEND_URL}/api/auth/register`, { name, email, password });
      // NOTE: Using a custom modal or message box is recommended instead of alert()
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error(err.response.data);
      // NOTE: Using a custom modal or message box is recommended instead of alert()
      alert(err.response.data.msg || 'Registration failed');
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
      <p style={{marginTop: '1.5rem', fontSize: '0.9rem'}}>Already have an account? <Link to="/login" style={{color: 'var(--accent-color)'}}>Login</Link></p>
    </div>
  );
};

export default Register;
