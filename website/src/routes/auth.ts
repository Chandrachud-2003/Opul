import express from 'express';
import { User } from '../models/User';
import { verifyToken } from '../middleware/auth';
import { Request, Response } from 'express';

const router = express.Router();

router.post('/verify-token', verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ firebaseUid: res.locals.user.uid });
    if (!user) {
      const newUser = await User.create({
        firebaseUid: res.locals.user.uid,
        email: res.locals.user.email,
        displayName: res.locals.user.name
      });
      res.json(newUser);
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 