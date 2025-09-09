const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Import the 'path' module
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// --- Middleware ---
// 1. Enable CORS for all API requests
app.use(cors());
// 2. Enable Express to parse JSON bodies
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---
// All of your API endpoints are registered here.
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/interview', require('./routes/interview'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/user', require('./routes/user')); 
app.use('/api/leaderboard', require('./routes/leaderboard'));

// --- Serve Static Frontend ---
// This section must come AFTER your API routes.
// It tells Express to serve your compiled React app in production.
if (process.env.NODE_ENV === 'production') {
  // Set the static folder where your React build is located
  app.use(express.static('client/build'));

  // This "catch-all" route handles any request that doesn't match an API route.
  // It sends back the main index.html file, allowing React Router to take over.
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
