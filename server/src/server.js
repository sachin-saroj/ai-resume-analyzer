require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/analysis', require('./routes/analysis'));
app.use('/api/applications', require('./routes/application'));
app.use('/api/analytics', require('./routes/analysis'));

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', msg: 'Elite Career Engine is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoURI) {
  mongoose.connect(mongoURI)
    .then(() => {
      console.log('✅ Connected to MongoDB (Elite Metrics Database)');
      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => {
      console.error('❌ Failed to connect to MongoDB, falling back to In-Memory Offline Mode:', err.message);
      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} (Offline Mode)`));
    });
} else {
  console.warn('⚠️ No MONGO_URI or MONGODB_URI environment variable set. Defaulting to In-Memory Offline Mode.');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} (Offline Mode)`));
}
