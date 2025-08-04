import React from 'react';
import '../animations.css'; 

const AnimatedPage = ({ children }) => {
  return (
    <div className="fade-in-up">
      {children}
    </div>
  );
};

export default AnimatedPage;
