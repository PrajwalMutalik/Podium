const User = require('../models/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const DAILY_LIMIT = 10; // You can change your daily limit here

// Function to verify if a Gemini API key is valid
const verifyGeminiApiKey = async (apiKey) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey.trim());
    // Use the correct, latest model ID
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    
    // Make a simple test request
    const result = await model.generateContent("Hello");
    
    // If the response is successful, the key is valid.
    return result.response.candidates.length > 0;
  } catch (error) {
    console.log('API key verification failed:', error.message);
    return false;
  }
};

const usageLimit = async (req, res, next) => {
  try {
    // 1. Get User ID from the 'auth' middleware
    if (!req.user || !req.user.id) {
      // This is a safeguard in case the auth middleware fails
      return res.status(401).json({ msg: 'Authentication error: User not identified.' });
    }
    const userId = req.user.id;

    // 2. Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    // 3. Check if user has their own API key and verify it
    const customApiKey = req.body.geminiApiKey;
    const hasStoredKey = user.geminiApiKey && user.geminiApiKey.trim() !== '';
    const hasRequestKey = customApiKey && customApiKey.trim() !== '';
    
    if (hasStoredKey || hasRequestKey) {
      console.log('🔍 Verifying custom API key...');
      
      // Choose which API key to verify
      const keyToVerify = hasRequestKey ? customApiKey.trim() : user.geminiApiKey.trim();
      
      // Verify the API key
      const isValidKey = await verifyGeminiApiKey(keyToVerify);
      
      if (isValidKey) {
        console.log('✅ UNLIMITED USAGE - Valid custom API key verified');
        return next(); // Valid API key = unlimited usage
      } else {
        console.log('❌ Invalid custom API key provided');
        // If user provided a custom API key but it's invalid, return error
        if (hasRequestKey) {
          return res.status(400).json({ 
            msg: 'Invalid API key provided. Please check your Gemini API key and try again.',
            error: 'Custom API key verification failed'
          });
        }
        // If stored key is invalid, continue to server API key logic
        console.log('⚠️ Stored API key is invalid, falling back to server API key');
      }
    }    // 4. Check if server has API key - if not, user must provide their own
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.trim() === '') {
      console.log('❌ No server API key available - user must provide their own');
      return res.status(400).json({ 
        msg: 'No Gemini API key available. Please add your own API key in Settings to use this feature.',
        requiresApiKey: true
      });
    }

    console.log('⚠️  DAILY LIMIT (10) - Using server API key with daily limit');
    const today = new Date().toISOString().split('T')[0]; // Gets 'YYYY-MM-DD' in UTC
    const lastUsage = user.lastApiUsageDate ? user.lastApiUsageDate.toISOString().split('T')[0] : null;

    if (lastUsage !== today) {
      // It's a new day. Reset the counter to 1 for the first request of the day.
      user.apiUsageCount = 1;
      user.lastApiUsageDate = new Date();
    } else {
      // It's the same day. Check if the limit has been reached.
      if (user.apiUsageCount >= DAILY_LIMIT) {
        return res.status(429).json({ msg: 'Daily API limit reached. Provide your own API key or try again tomorrow.' });
      }
      // If the limit is not reached, increment the counter.
      user.apiUsageCount += 1;
    }

    // 5. Save the changes and proceed
    await user.save();
    next(); // All good, proceed to the main route logic

  } catch (error) {
    console.error('Error in usageLimit middleware:', error);
    res.status(500).send('Server Error');
  }
};

module.exports = usageLimit;
