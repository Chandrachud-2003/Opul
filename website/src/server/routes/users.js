import express from 'express';
import { User } from '../models/User.js';
import { ReferralCode } from '../models/ReferralCode.js';

const router = express.Router();

router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    console.log('Searching for user with identifier:', identifier);
    
    // Add debug logging
    console.log('Request headers:', req.headers);
    console.log('Request params:', req.params);
    
    // Try finding by UID first
    let user = await User.findOne({ uid: identifier });
    console.log('Search by uid result:', user);
    
    // If not found, try email
    if (!user) {
      user = await User.findOne({ email: identifier });
      console.log('Search by email result:', user);
    }
    
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);

    // Format the response
    const response = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      credibilityScore: user.credibilityScore || 0,
      isPremium: user.isPremium || false,
      stats: user.stats || {
        totalClicks: 0,
        totalEarnings: 0,
        lastClickedAt: null
      },
      referralCodes: [] // Add referral codes logic here if needed
    };

    res.json(response);
  } catch (error) {
    console.error('Error in /:identifier:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;
    
    console.log('Creating/updating user with data:', { uid, email, displayName, photoURL });
    
    if (!uid || !email) {
      return res.status(400).json({ 
        message: 'Missing required fields: uid and email are required' 
      });
    }

    const user = await User.findOneAndUpdate(
      { uid },
      {
        uid,
        email,
        displayName,
        profilePicture: photoURL,
        lastLoginAt: new Date(),
        'metadata.lastUpdated': new Date()
      },
      { 
        upsert: true, 
        new: true,
        runValidators: true
      }
    );

    res.status(200).json(user);
  } catch (error) {
    console.error('Error in /:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

export default router; 