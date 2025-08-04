const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const Session = require('../models/Session');
const fs = require('fs');
const { AssemblyAI } = require('assemblyai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const assemblyClient = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const upload = multer({ dest: 'uploads/' });

router.post('/submit', [auth, upload.single('audio')], async (req, res) => {
  const { questionText } = req.body;
  if (!req.file || !questionText) {
    return res.status(400).send('Missing audio file or question text.');
  }

  const filePath = req.file.path;

  try {
    const uploadUrl = await assemblyClient.files.upload(filePath);
    const transcript = await assemblyClient.transcripts.transcribe({ audio_url: uploadUrl });

    if (transcript.status === 'error' || !transcript.text) {
      return res.status(500).json({ msg: 'Error transcribing audio or transcript is empty.' });
    }

    const wordCount = transcript.words.length;
    const durationInSeconds = transcript.audio_duration / 1000;

    let wpm = 0;
    if (durationInSeconds > 0) {
        wpm = Math.round((wordCount / durationInSeconds) * 60);
    }

    const fillerWordsList = ['um', 'uh', 'er', 'ah', 'like', 'okay', 'right', 'so', 'you know'];
    let fillerWordCount = 0;
    let foundFillers = [];
    transcript.words.forEach(word => {
        if (fillerWordsList.includes(word.text.toLowerCase().replace(/[,.]/g, ''))) {
            fillerWordCount++;
            foundFillers.push(word.text);
        }
    });

    const prompt = `
    You are an expert career coach providing feedback for a practice interview.
    The user was asked the following question: "${questionText}"

    Here is the user's answer: "${transcript.text}"

    Here are the delivery metrics:
    - Pace: ${wpm} Words Per Minute. The ideal pace is between 140-160 WPM.
    - Filler Words: The user said ${fillerWordCount} filler words.

    Please provide concise, constructive feedback in a friendly and encouraging tone.
    Address both the content of their answer (how well they answered the question) and their delivery (pace, clarity).
    Structure your feedback in a few short paragraphs.
    `;

    const result = await model.generateContent(prompt);
    const aiFeedback = await result.response.text();

    const analysisResult = {
      transcript: transcript.text,
      wpm: wpm,
      fillerWordCount: fillerWordCount,
      foundFillers: foundFillers,
      aiFeedback: aiFeedback
    };

    const newSession = new Session({
        user: req.user.id,
        questionText: questionText,
        transcript: analysisResult.transcript,
        wpm: analysisResult.wpm,
        fillerWordCount: analysisResult.fillerWordCount,
        aiFeedback: analysisResult.aiFeedback,
    });
    await newSession.save();

    res.status(200).json(analysisResult);

  } catch (error) {
    console.error('Error in interview submission route:', error);
    res.status(500).send('Error analyzing audio.');
  } finally {
    fs.unlinkSync(filePath);
  }
});

module.exports = router;