import React from 'react';
import '../animations.css'; // Import the new animation styles

const AnimatedPage = ({ children }) => {
  return (
    // This div applies the animation to any page content passed to it
    <div className="fade-in-up">
      {children}
    </div>
  );
};

export default AnimatedPage;
