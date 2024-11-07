import express from 'express';
import { ReferralCode } from '../models/ReferralCode.js';
import { Platform } from '../models/Platform.js';
import { User } from '../models/User.js';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const createReferralLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 submissions per hour
  message: 'Too many referral submissions, please try again later'
});

router.post('/', createReferralLimit, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { platformId, userId, referralValue, type } = req.body;

    // Check for existing active referral
    const existingReferral = await ReferralCode.findOne({
      platformId,
      userId,
      status: 'ACTIVE'
    }).session(session);

    if (existingReferral) {
      await session.abortTransaction();
      return res.status(400).json({ 
        message: 'You already have an active referral for this platform' 
      });
    }

    // Create new referral
    const referral = new ReferralCode({
      platformId,
      userId,
      [type === 'code' ? 'code' : 'referralLink']: referralValue,
      sourceType: 'USER_SUBMITTED',
      status: 'ACTIVE',
      metadata: {
        lastUpdated: new Date(),
        version: 1
      }
    });

    await referral.save({ session });

    // Update user's referral list
    await User.findByIdAndUpdate(
      userId,
      { $push: { referralCodes: referral._id } },
      { session }
    );

    // Update platform's referral list
    await Platform.findByIdAndUpdate(
      platformId,
      { $push: { referralCodes: referral._id } },
      { session }
    );

    await session.commitTransaction();
    res.status(201).json({ success: true, referral });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error creating referral:', error);
    res.status(500).json({ 
      message: error.message || 'Error creating referral' 
    });
  } finally {
    session.endSession();
  }
});

// Add this new route to check for existing referrals
router.get('/check/:platformId/:userId', async (req, res) => {
  try {
    const { platformId, userId } = req.params;
    
    const user = await User.findOne({ uid: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingReferral = await ReferralCode.findOne({
      platformId,
      userId: user._id,
      status: 'ACTIVE'
    });

    res.json({ exists: !!existingReferral });
  } catch (error) {
    console.error('Error checking referral:', error);
    res.status(500).json({ message: 'Error checking referral' });
  }
});

// Add these new routes
router.get('/user/:platformId', authMiddleware, async (req, res) => {
  try {
    const { platformId } = req.params;
    const userId = req.user._id; // Now req.user will be populated

    const referrals = await ReferralCode.find({
      platformId,
      userId,
      status: 'ACTIVE'
    }).sort({ createdAt: -1 });

    res.json({ referrals });
  } catch (error) {
    console.error('Error fetching user referrals:', error);
    res.status(500).json({ message: 'Error fetching referrals' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { referralValue, type } = req.body;
    const userId = req.user._id; // Now req.user will be populated

    const referral = await ReferralCode.findOne({
      _id: id,
      userId
    });

    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }

    // Update the referral
    if (type === 'code') {
      referral.code = referralValue;
    } else {
      referral.referralLink = referralValue;
    }

    referral.metadata.lastUpdated = new Date();
    await referral.save();

    res.json({ success: true, referral });
  } catch (error) {
    console.error('Error updating referral:', error);
    res.status(500).json({ message: 'Error updating referral' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; // Now req.user will be populated

    const referral = await ReferralCode.findOneAndUpdate(
      { _id: id, userId },
      { status: 'EXPIRED' },
      { new: true }
    );

    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting referral:', error);
    res.status(500).json({ message: 'Error deleting referral' });
  }
});

export default router; 