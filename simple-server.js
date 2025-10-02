const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CaperSports Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Basic API routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Catch all handler for React routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
});

module.exports = app;
