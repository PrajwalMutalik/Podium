import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuota } from '../context/QuotaContext';
import { BASE_URL } from '../config/api';
import AnalysisReport from './AnalysisReport';
import AudioVisualizer from './AudioVisualizer';
import './InterviewRoom.css';

const InterviewRoom = () => {
  const { fetchUserProfile } = useAuth();
  const { userApiKey } = useAuth();
  const { fetchQuota } = useQuota();
  const location = useLocation();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const fetchQuestion = useCallback(async () => {
    const params = new URLSearchParams(location.search);
    const role = params.get('role');
    const category = params.get('category');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/questions/random`, {
        headers: { 'x-auth-token': token },
        params: { role, category },
      });
      setQuestion(res.data);
    } catch (error) {
      console.error('Error fetching question:', error);
      if (error.response && error.response.status === 404) {
        setQuestion({ text: 'No questions found for this category. Please try a different one.' });
      } else {
        setQuestion({ text: 'Could not load a question. Please check your connection.' });
      }
    }
  }, [location.search]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const startRecording = async () => {
    setAnalysis(null);
    audioChunks.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      setIsRecording(true);

      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
      mediaRecorder.current.onstop = handleStopRecording;
      mediaRecorder.current.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check your browser permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.stream) {
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorder.current.stop();
      setIsRecording(false);
      setAudioStream(null);
    }
  };

  const handleStopRecording = async () => {
    setIsProcessing(true);
    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    if (question) {
      formData.append('questionText', question.text);
    }
    if (userApiKey) {
      formData.append('geminiApiKey', userApiKey);
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${BASE_URL}/api/interview/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
      });
      setAnalysis(res.data);
      await fetchQuota();
      fetchUserProfile();
    } catch (error) {
      console.error('Error uploading audio:', error);
      if (error.response && error.response.status === 429) {
        alert('Daily usage limit reached.');
      } else {
        alert('Failed to submit your answer. Please try again.');
      }
    }
    setIsProcessing(false);
  };

  const handleNextQuestion = () => {
    setAnalysis(null);
    setQuestion(null);
    fetchQuestion();
  };

  const renderContent = () => {
    if (analysis) {
      return <AnalysisReport analysis={analysis} onNext={handleNextQuestion} />;
    }

    if (isProcessing) {
      return (
        <div className="processing-state">
          <div className="spinner-ring"></div>
          <p className="processing-text">Analyzing your response...</p>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>This usually takes 5-10 seconds.</p>
        </div>
      );
    }

    if (!question) {
      return (
        <div className="processing-state">
          <div className="spinner-ring" style={{ width: '30px', height: '30px' }}></div>
          <p>Loading question...</p>
        </div>
      );
    }

    if (question.text && (question.text.startsWith('No questions') || question.text.startsWith('Could not load'))) {
      return (
        <div className="error-container">
          <h3>Oops!</h3>
          <p>{question.text}</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Return to Dashboard
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="interview-header">
          <p className="question-label">Interview Question</p>
          <h1 className="question-text">{question.text}</h1>
        </div>

        {/* Visualizer Area - only visible when recording or stream acts */}
        <div className="visualizer-container">
          {isRecording && audioStream ? (
            <AudioVisualizer audioStream={audioStream} />
          ) : (
            <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
              Press the microphone to start answering...
            </p>
          )}
        </div>

        <div className="controls-bar">
          {/* Skip Button (Optional, but good for UX) */}
          <button
            className="control-action-btn"
            onClick={handleNextQuestion}
            disabled={isRecording}
            title="Skip to next question"
          >
            Skip
          </button>

          {/* Main Record FAB */}
          <div className="record-btn-wrapper">
            {!isRecording ? (
              <button className="record-btn" onClick={startRecording} title="Start Recording">
                🎤
              </button>
            ) : (
              <button className="record-btn recording" onClick={stopRecording} title="Stop Recording">
                <div className="stop-icon"></div>
              </button>
            )}
          </div>

          {/* End Session */}
          <button className="control-action-btn end" onClick={() => navigate('/dashboard')}>
            End Session
          </button>
        </div>
      </>
    );
  };

  return <div className="glass-container interview-container">{renderContent()}</div>;
};

export default InterviewRoom;
