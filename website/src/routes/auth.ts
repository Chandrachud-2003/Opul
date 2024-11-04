import express from 'express';
import { User } from '../models/User';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.post('/verify-token', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      // Create new user if first time
      const newUser = await User.create({
        firebaseUid: req.user.uid,
        email: req.user.email,
        displayName: req.user.name
      });
      return res.json(newUser);
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 