import dotenv from 'dotenv';
dotenv.config();

import './config/firebase.js';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import platformRoutes from './routes/platforms.js';
import referralRoutes from './routes/referrals.js';
import { User } from './models/User.js';

const app = express();

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// CORS configuration
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
}));

app.options('*', cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes with the /api/users prefix
app.use('/api/users', userRoutes);

// Mount the auth routes
app.use('/api/auth', authRoutes);

// Mount the platform routes
app.use('/api/platforms', platformRoutes);

// Mount the referrals routes
app.use('/api/referrals', referralRoutes);

// Connect to MongoDB before starting the server
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'Opul' // Explicitly set the database name
})
  .then(async () => {
    console.log('Connected to MongoDB successfully');
    
    // Add debug logging
    try {
      const userCount = await User.countDocuments();
      console.log(`Database contains ${userCount} users`);
    } catch (err) {
      console.error('Error checking user count:', err);
    }
    
    // Start server
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Server error',
    error: err.message 
  });
});