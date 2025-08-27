// server/middleware/usageLimit.js

const User = require('../models/User');
const DAILY_LIMIT = 10; // You can change your daily limit here

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

    // 3. Bypass limit if user has their own API key
    if (user.geminiApiKey) {
      return next(); // User has their own key, so we skip the limit check
    }

    // 4. Check and reset the daily counter
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