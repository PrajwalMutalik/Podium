const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

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

module.exports = router;