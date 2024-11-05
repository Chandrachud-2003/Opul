const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true // If you're using cookies/sessions
}));

// ... rest of your server code ... 