const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const auth = require('../middleware/auth'); 


router.get('/random', auth, async (req, res) => {
  try {
    const { role, category } = req.query;
    const filter = {};
    if (role && role !== 'All') {
      filter.role = role;
    }
    if (category && category !== 'All') {
      filter.category = category;
    }

    console.log('Fetching question with filter:', filter);

    const count = await Question.countDocuments(filter);
    if (count === 0) {
      return res.status(404).json({ msg: 'No questions found matching your criteria.' });
    }

    const random = Math.floor(Math.random() * count);
    const question = await Question.findOne(filter).skip(random);
    
    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;