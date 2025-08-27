import React from 'react';

const CSFundamentalsCard = () => {
  const topics = [
    'Operating Systems (OS)',
    'Object-Oriented Programming (OOPS)',
    'Computer Networks',
    'Database Management Systems (DBMS)',
    'Data Structures and Algorithms (DSA)',
    'Computer Organization (CO)',
    'SQL',
    'General Interview Prep'
  ];

  return (
    <div className="resource-card">
      <h2>CS Fundamentals Resource Pack</h2>
      <ul className="resource-list">
        {topics.map((topic, index) => (
          <li key={index}>{topic}</li>
        ))}
      </ul>
      <a 
        href="https://drive.google.com/drive/folders/1fHNvNDuURUfYgP2bboYQBlpqOGtfoiRR" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="download-button"
      >
        Download Resources
      </a>
    </div>
  );
};

export default CSFundamentalsCard;
  