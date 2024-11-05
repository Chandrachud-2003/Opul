import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;
    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      {
        email,
        displayName,
        profilePicture: photoURL,
        lastLoginAt: new Date(),
        'metadata.lastUpdated': new Date()
      },
      { upsert: true, new: true }
    );
    res.json(user);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 