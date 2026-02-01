import React, { useState } from 'react';
import axios from 'axios';
import './ContactPage.css';
import { BASE_URL } from '../config/api';

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
    setStatus({ type: 'pending', message: 'Sending message...' });

    try {
      await axios.post(
        `${BASE_URL}/api/contact`,
        { name, email, message },
        { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
      );

      setStatus({ type: 'success', message: 'Message sent! We\'ll be in touch.' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      let errorMessage = 'Failed to send message.';
      if (error.response?.data?.msg) errorMessage = error.response.data.msg;
      setStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Get in Touch</h1>
        <p>Questions, feedback, or just want to say hi? We're here for you.</p>
      </div>

      <div className="contact-grid">
        {/* LEFT: FORM */}
        <div className="contact-form-panel">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                className="contact-input"
                value={name}
                onChange={onChange}
                placeholder="Your Name"
                required
                minLength="2"
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                className="contact-input"
                value={email}
                onChange={onChange}
                placeholder="Your Email"
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                className="contact-textarea"
                value={message}
                onChange={onChange}
                placeholder="How can we help?"
                rows="5"
                required
                minLength="10"
              ></textarea>
            </div>

            <button type="submit" className="btn-send" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message 🚀'}
            </button>

            {status.message && (
              <div className={`status-message ${status.type}`}>
                {status.message}
              </div>
            )}
          </form>
        </div>

        {/* RIGHT: INFO UI */}
        <div className="contact-info-panel">
          <div className="info-card">
            <div className="info-icon">📧</div>
            <div className="info-text">
              <h3>Email Us</h3>
              <p>support@podium.ai</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">🐦</div>
            <div className="info-text">
              <h3>Twitter</h3>
              <p>@PodiumAI</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">💻</div>
            <div className="info-text">
              <h3>GitHub</h3>
              <a href="https://github.com/PrajwalMutalik/Podium">Check our changelog</a>
            </div>
          </div>

          <div className="info-card" style={{ marginTop: 'auto', background: 'rgba(99, 102, 241, 0.1)', borderColor: 'var(--accent-primary)' }}>
            <div className="info-icon">⚡</div>
            <div className="info-text">
              <h3>Quick Tip</h3>
              <p>We usually reply within 24 hours!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
