const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];

// Log the port to verify what Railway is providing
console.log(`CORS_ORIGIN: ${process.env.CORS_ORIGIN}`);
console.log(`Allowed Origins: ${allowedOrigins}`);
console.log(`Railway's provided PORT: ${process.env.PORT}`);

// CORS middleware with specific origin handling
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://podium-client-ckm5.onrender.com',
      'http://localhost:5173',
      'http://localhost:3000'
    ];
    
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(null, false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true,
  exposedHeaders: ['x-auth-token']
}));

app.use(express.json());

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Successfully connected to MongoDB.');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Exit the process if the database connection fails
    process.exit(1);
  }
};

connectDB();

// --- API Routes ok ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/interview', require('./routes/interview'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/user', require('./routes/user'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// --- Start Server ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
