import React, { useState } from 'react';
import axios from 'axios';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const { name, email, message } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Use the environment variable for the backend URL
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setStatus('Sending...');
    try {
      await axios.post(`${BACKEND_URL}/api/contact`, { name, email, message });
      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' }); 
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="glass-container">
      <h1>Contact Us</h1>
      <p>Have a question, feedback, or a partnership inquiry? We'd love to hear from you. Please fill out the form below.</p>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={name} onChange={onChange} placeholder="Your Name" required />
        <input type="email" name="email" value={email} onChange={onChange} placeholder="Your Email" required />
        <textarea name="message" value={message} onChange={onChange} placeholder="Your Message" rows="6" required></textarea>
        <button type="submit" disabled={status === 'Sending...'}>
          {status === 'Sending...' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      {status && <p style={{ marginTop: '1rem', textAlign: 'center' }}>{status}</p>}
    </div>
  );
};

export default ContactPage;
