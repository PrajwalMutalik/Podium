import React, { useState } from 'react';
import axios from 'axios';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { name, email, message } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: 'pending', message: 'Sending...' });
    
    try {
      console.log('Attempting to send message...');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/contact`, 
        { name, email, message },
        { 
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000 // 10 second timeout
        }
      );
      
      console.log('Server response:', response.data);
      setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact form error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      let errorMessage = 'Failed to send message. Please try again later.';
      
      if (error.response?.data?.detail) {
        errorMessage = `Error: ${error.response.data.detail}`;
      } else if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      }
      
      setStatus({ 
        type: 'error', 
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container glass-container">
      <h1>Contact Us</h1>
      <p className="contact-description">
        Have a question, feedback, or a partnership inquiry? We'd love to hear from you. 
        Fill out the form below and we'll get back to you as soon as possible.
      </p>
      
      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          placeholder="Your Name"
          required
          minLength="2"
          maxLength="50"
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Your Email"
          required
        />
        <textarea
          name="message"
          value={message}
          onChange={onChange}
          placeholder="Your Message"
          rows="6"
          required
          minLength="10"
          maxLength="1000"
        ></textarea>
        <button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      
      {status.message && (
        <div className={`status-message ${status.type}`}>
          {status.message}
        </div>
      )}
    </div>
  );
};

export default ContactPage;
