const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const usageLimit = require('../middleware/usageLimit');
const User = require('../models/User');
const Session = require('../models/Session');
const fs = require('fs');
const { AssemblyAI } = require('assemblyai');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const { processGamification } = require('../services/gamificationService'); // 👈 Import the service

const assemblyClient = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });

// Only create default Gemini model if server API key exists
let genAI = null;
let model = null;

if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: "application/json",
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ],
  });
}

const upload = multer({ dest: 'uploads/' });
const DAILY_LIMIT = 10;
router.get('/check-quota', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // For users with their own stored key, they have unlimited usage
    if (user.geminiApiKey && user.geminiApiKey.trim() !== '') {
      return res.json({ currentUsage: 0, dailyLimit: 'Unlimited' });
    }

    // If no server API key is available, users must provide their own
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.trim() === '') {
      return res.json({ 
        currentUsage: 0, 
        dailyLimit: 0,
        requiresApiKey: true,
        message: 'Please add your own Gemini API key in Settings to use this feature.'
      });
    }

    // For users without API key but server has one, they have daily limit of 10
    const today_utc_string = new Date().toISOString().split('T')[0];
    const last_usage_utc_string = user.lastApiUsageDate 
      ? user.lastApiUsageDate.toISOString().split('T')[0] 
      : null;
      
    let currentUsage = user.apiUsageCount;

    // If the last usage was not today, the current usage is effectively 0 for today
    if (today_utc_string !== last_usage_utc_string) {
      currentUsage = 0;
    }
    
    // Send back the current usage and the defined limit of 10
    res.json({ currentUsage, dailyLimit: DAILY_LIMIT });

  } catch (error) {
    console.error('Error in /check-quota route:', error);
    res.status(500).send('Server Error');
  }
});


router.post('/submit', [auth, upload.single('audio'), usageLimit], async (req, res) => {
  const { questionText, geminiApiKey } = req.body;
  
  console.log("=== DEBUG INFO ===");
  console.log("questionText received:", !!questionText);
  console.log("geminiApiKey from request:", geminiApiKey ? `${geminiApiKey.substring(0, 10)}...` : 'Not provided');
  console.log("geminiApiKey length:", geminiApiKey ? geminiApiKey.length : 0);
  
  if (!req.file || !questionText) {
    return res.status(400).send('Missing audio file or question text.');
  }

  const filePath = req.file.path;

  try {
    console.log("1. Uploading file to AssemblyAI...");
    const uploadUrl = await assemblyClient.files.upload(filePath);
    console.log("2. Transcribing audio...");
    const transcript = await assemblyClient.transcripts.transcribe({ audio_url: uploadUrl });

    if (transcript.status === 'error' || !transcript.text) {
      console.error("AssemblyAI transcription failed:", transcript.error);
      return res.status(500).json({ msg: 'Error transcribing audio.' });
    }

    console.log("3. Generating AI feedback...");
    
    // Get the user from database to check for stored API key
    const user = await User.findById(req.user.id);
    const userStoredApiKey = user ? user.geminiApiKey : null;
    
    console.log("User stored API key:", userStoredApiKey ? `${userStoredApiKey.substring(0, 10)}...` : 'Not stored');
    console.log("Request API key provided:", geminiApiKey ? `${geminiApiKey.substring(0, 10)}...` : 'Not provided');
    
    // PRIORITY: Always prioritize user-provided API keys over server API key
    // 1. Use request API key if provided
    // 2. Use stored user API key if available
    // 3. Fall back to server API key only if no user key is available
    
    let aiModel = null;
    let apiKeyToUse = geminiApiKey || userStoredApiKey;
    let usingUserApiKey = false;
    
    if (apiKeyToUse && apiKeyToUse.trim() !== '') {
      console.log("🔑 Using user-provided Gemini API key for this request");
      console.log("Final API key starts with:", apiKeyToUse.trim().substring(0, 10) + "...");
      console.log("Final API key length:", apiKeyToUse.trim().length);
      usingUserApiKey = true;
      
      try {
        const customGenAI = new GoogleGenerativeAI(apiKeyToUse.trim());
        aiModel = customGenAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: {
            responseMimeType: "application/json",
          },
          safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
          ],
        });
        console.log("✅ Custom Gemini model created successfully");
      } catch (modelError) {
        console.error("❌ Error creating custom Gemini model:", modelError);
        return res.status(400).json({ 
          msg: 'Invalid API key provided. Please check your Gemini API key and try again.',
          error: 'Custom API key configuration failed'
        });
      }
    } else if (model) {
      console.log("🏢 Using default server API key (no user API key provided)");
      aiModel = model;
      usingUserApiKey = false;
    } else {
      console.log("❌ No API key available - neither user nor server");
      return res.status(400).json({ 
        msg: 'No Gemini API key available. Please add your own API key in Settings to use this feature.',
        error: 'No API key configured'
      });
    }
    
    const prompt = `
    You are an expert career coach. Analyze the user's interview answer.
    The user was asked: "${questionText}"
    The user's answer was: "${transcript.text}"
    Please provide your analysis as a JSON object with two keys: "feedback" and "improvements".
    - "feedback": A concise, friendly paragraph summarizing the answer.
    - "improvements": A concise, friendly paragraph with actionable suggestions.
    `;
    
    let result;
    try {
      result = await aiModel.generateContent(prompt);
    } catch (apiError) {
      console.error("Error calling Gemini API:", apiError);
      
      // If it's a custom API key error, provide specific feedback
      if (geminiApiKey && apiError.message.includes('API key not valid')) {
        return res.status(400).json({ 
          msg: 'Your custom API key is invalid. Please check your Gemini API key in Settings and try again.',
          error: 'Invalid custom API key'
        });
      }
      
      // For other API errors, fall back to generic error
      return res.status(500).json({ 
        msg: 'Error generating AI feedback. Please try again.',
        error: 'AI service unavailable'
      });
    }
    const responseText = await result.response.text();
    console.log("4. AI response received:", responseText); // Log the raw AI response

    // --- SAFER JSON PARSING ---
    let aiAnalysis = {};
    try {
      aiAnalysis = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      // If parsing fails, we create a default object so the app doesn't crash.
      aiAnalysis = {
        feedback: "There was an issue generating feedback. Please try again.",
        improvements: "Could not generate improvement suggestions at this time."
      };
    }

    const wordCount = transcript.words.length;
    const durationInSeconds = transcript.audio_duration / 1000;
    let wpm = durationInSeconds > 0 ? Math.round((wordCount / durationInSeconds) * 60) : 0;
    const fillerWordsList = ['um', 'uh', 'er', 'ah', 'like', 'okay', 'right', 'so', 'you know'];
    let fillerWordCount = 0;
    let foundFillers = [];
    transcript.words.forEach(word => {
      if (fillerWordsList.includes(word.text.toLowerCase().replace(/[,.]/g, ''))) {
        fillerWordCount++;
        foundFillers.push(word.text);
      }
    });

    // Use the parsed data, with fallbacks to default text if properties are missing.
    const analysisResult = {
      transcript: transcript.text,
      wpm: wpm,
      fillerWordCount: fillerWordCount,
      foundFillers: foundFillers,
      feedback: aiAnalysis.feedback || "Feedback could not be generated.",
      improvements: aiAnalysis.improvements || "Improvement suggestions could not be generated."
    };

    console.log("5. Saving session to database...");
    const newSession = new Session({
      user: req.user.id,
      questionText: questionText,
      ...analysisResult // Spread the result to save all fields
    });
    await newSession.save();
    console.log("6. Session saved. Processing gamification...");
    await processGamification(req.user.id, analysisResult);
    console.log("7. Gamification processed. Sending response.");
    res.status(200).json(analysisResult);

  } catch (error) {
    console.error('---!!! ERROR IN SUBMIT ROUTE !!!---', error);
    res.status(500).send('Error analyzing audio.');
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

module.exports = router;
