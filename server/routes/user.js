const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Function to verify Gemini API key
const verifyGeminiApiKey = async (apiKey) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Make a simple test request
    const result = await model.generateContent("Test");
    const response = await result.response;
    
    return response.text() ? true : false;
  } catch (error) {
    console.log('API key verification failed:', error.message);
    return false;
  }
};

// @route   GET api/user/me
// @desc    Get current user's profile data (for dashboard)
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // Find user by ID from the token and exclude the password from the response
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/user/update-api-key
// @desc    Update user's Gemini API key (with verification)
// @access  Private
router.post('/update-api-key', auth, async (req, res) => {
  try {
    const { geminiApiKey } = req.body;
    
    // Find user by ID from the token
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // If removing API key (empty or null)
    if (!geminiApiKey || geminiApiKey.trim() === '') {
      console.log('🗑️ Removing API key - reverting to 10 daily limit');
      user.geminiApiKey = '';
      await user.save();
      
      return res.json({ 
        msg: 'API key removed successfully. You now have 10 requests per day.',
        hasApiKey: false,
        verified: false,
        dailyLimit: 10
      });
    }
    
    // If API key is provided, verify it first
    console.log('🔍 Verifying API key before saving...');
    
    const isValidKey = await verifyGeminiApiKey(geminiApiKey);
    
    if (!isValidKey) {
      return res.status(400).json({ 
        msg: 'Invalid API key. Please check your Gemini API key and try again.',
        error: 'API_KEY_INVALID'
      });
    }
    
    console.log('✅ API key verified successfully');
    
    // Save the verified API key
    user.geminiApiKey = geminiApiKey.trim();
    await user.save();
    
    res.json({ 
      msg: 'Valid API key saved successfully! You now have unlimited usage.',
      hasApiKey: true,
      verified: true,
      dailyLimit: 'Unlimited'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;