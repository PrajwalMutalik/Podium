import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-container">
      {/* HERO SECTION */}
      <div className="mission-hero">
        <h1>Master Your Interview Skills</h1>
        <p className="mission-subtitle">
          Podium is an AI-powered coaching platform designed to democratize high-quality interview preparation.
          Practice anytime, anywhere, and get instant, actionable feedback.
        </p>
      </div>

      {/* TECH STACK */}
      <div className="section-header">
        <h2>Powered by Modern Tech</h2>
        <p>Built with cutting-edge tools to deliver a seamless experience.</p>
      </div>

      <div className="tech-grid">
        <div className="tech-card">
          <div className="tech-icon">🤖</div>
          <h3>Google Gemini AI</h3>
          <p>
            Generates realistic interview questions and provides granular feedback on your answers, ensuring you improve with every session.
          </p>
        </div>
        <div className="tech-card">
          <div className="tech-icon">🎙️</div>
          <h3>Web Speech API</h3>
          <p>
            Captures your speech in real-time with high fidelity, analyzing your tone, pace, and clarity for a complete performance review.
          </p>
        </div>
        <div className="tech-card">
          <div className="tech-icon">⚡</div>
          <h3>Real-time Analytics</h3>
          <p>
            Track your WPM (Words Per Minute), filler words, and improvement trends over time with our custom analytics engine.
          </p>
        </div>
      </div>

      {/* STORY SECTION */}
      <div className="story-section">
        <div className="story-content">
          <div className="story-text">
            <h2>Why Podium?</h2>
            <p>
              Interviews are stressful. Whether you're a fresh graduate or a seasoned professional,
              the pressure to perform can be overwhelming. We realized that while there are many resources to *learn* coding or theory,
              there were few places to *practice* speaking confidently.
            </p>
            <p>
              Podium bridges that gap. By combining the latest in Generative AI with speech analysis,
              we give you a safe, judgment-free zone to fail, learn, and eventually succeed.
            </p>

            <div className="story-stat">
              <div className="stat-item">
                <h4>24/7</h4>
                <span>Availability</span>
              </div>
              <div className="stat-item">
                <h4>100%</h4>
                <span>Private & Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
