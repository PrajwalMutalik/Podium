// server/routes/leaderboard.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth'); // We'll protect this route

// @route   GET api/leaderboard
// @desc    Get top 20 users by points
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const leaderboard = await User.find()
      .sort({ points: -1 }) // -1 means descending order
      .limit(20) // Limit to the top 20 users
      .select('name points badges'); // Select only the fields we need

    res.json(leaderboard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;