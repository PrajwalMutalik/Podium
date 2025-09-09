import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuota } from '../context/QuotaContext';
import AnalysisReport from './AnalysisReport';
import Spinner from './Spinner';
import AudioVisualizer from './AudioVisualizer';

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

  // Use the correct environment variable name
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // This function fetches the question from the backend
  const fetchQuestion = useCallback(async () => {
    const params = new URLSearchParams(location.search);
    const role = params.get('role');
    const category = params.get('category');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${VITE_API_BASE_URL}/api/questions/random`, {
        headers: { 'x-auth-token': token },
        params: { role, category },
      });
      setQuestion(res.data);
    } catch (error) {
      console.error('Error fetching question:', error);
      setQuestion({ text: 'Could not load a question. Please check your connection or try different filters.' });
    }
  }, [location.search, VITE_API_BASE_URL]);

  // This effect runs once when the component loads to get the first question
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
      window.confirm("Could not access microphone. Please check your browser permissions.");
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
      const res = await axios.post(`${VITE_API_BASE_URL}/api/interview/submit`, formData, {
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
        window.confirm('Daily usage limit reached. Please try again tomorrow or upgrade your plan.');
      } else {
        window.confirm('Failed to submit your answer. Please try again.');
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
        <>
          <h2>Analyzing Your Answer...</h2>
          <p className="question-text">{question?.text}</p>
          <Spinner text="Please wait, the AI is thinking..." />
        </>
      );
    }
    if (!question) {
      return <Spinner text="Loading question..." />;
    }
    return (
      <>
        <h2>Interview Question:</h2>
        <p className="question-text">{question?.text}</p>
        {isRecording && audioStream && (
          <div className="visualizer-wrapper">
            <AudioVisualizer audioStream={audioStream} />
          </div>
        )}
        <div className="controls">
          {!isRecording ? (
            <button onClick={startRecording}>Start Recording</button>
          ) : (
            <button onClick={stopRecording}>Stop Recording</button>
          )}
          <button onClick={() => navigate('/dashboard')} className="end-session-button">
            End Session
          </button>
        </div>
      </>
    );
  };

  return <div className="glass-container">{renderContent()}</div>;
};

export default InterviewRoom;
