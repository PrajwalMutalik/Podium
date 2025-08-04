import React from 'react';

const AnalysisReport = ({ analysis, onNext }) => {
  return (
    <div className="analysis-container">
      <h2>Your Analysis</h2>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Pace</h3>
          <p>{analysis.wpm} WPM</p>
          <span>(Avg. is 140-160 WPM)</span>
        </div>
        <div className="metric-card">
          <h3>Filler Words</h3>
          <p>{analysis.fillerWordCount}</p>
          <span>{analysis.foundFillers?.slice(0, 5).join(', ')}</span>
        </div>
      </div>

  
      <div className="ai-feedback">
        <h3>AI Coach Feedback</h3>
        <p>{analysis.aiFeedback}</p>
      </div>

      <h3>Your Answer Transcript:</h3>
      <p className="transcript-text">{analysis.transcript}</p>

      <button onClick={onNext} className="next-button">
        Next Question
      </button>
    </div>
  );
};

export default AnalysisReport;