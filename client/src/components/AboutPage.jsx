import React from 'react';

const AboutPage = () => {
  return (
    <div className="glass-container">
      <h1>About Podium</h1>
      <p style={{textAlign: 'left', marginBottom: '2rem'}}>
        Podium is an AI-powered interview coaching platform designed to help students and professionals prepare for their dream job interviews. We believe that practice is the key to success, and our mission is to provide an accessible, realistic, and insightful practice environment for everyone.
      </p>
      <p style={{textAlign: 'left'}}>
        Our platform uses cutting-edge speech-to-text and generative AI technologies to provide instant, objective feedback on your communication skills, the content of your answers, and your overall delivery. Whether you're preparing for a technical deep-dive or a behavioral discussion, Podium is here to help you build confidence and polish your performance.
      </p>
    </div>
  );
};

export default AboutPage;
