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

router.post('/', authMiddleware, createReferralLimit, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { platformSlug, userId, referralValue, type } = req.body;

    // Validate required fields
    if (!platformSlug || !referralValue || !type) {
      await session.abortTransaction();
      return res.status(400).json({ 
        message: 'Missing required fields: platformSlug, referralValue, and type are required' 
      });
    }

    // Get the user from the auth middleware
    const user = req.user;
    if (!user) {
      await session.abortTransaction();
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check for existing active referral
    const existingReferral = await ReferralCode.findOne({
      platformSlug,
      userId: user._id,
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
      platformSlug,
      userId: user._id,
      [type === 'code' ? 'code' : 'referralLink']: referralValue,
      sourceType: 'USER_SUBMITTED',
      status: 'ACTIVE'
    });

    await referral.save({ session });

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
router.get('/check/:platformSlug/:userId', async (req, res) => {
  try {
    const { platformSlug, userId } = req.params;
    
    const user = await User.findOne({ uid: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingReferral = await ReferralCode.findOne({
      platformSlug,
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
router.get('/user/:platformSlug', authMiddleware, async (req, res) => {
  try {
    const { platformSlug } = req.params;
    const userId = req.user._id;

    const referrals = await ReferralCode.find({
      platformSlug,
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
    const userId = req.user._id;

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
    const userId = req.user._id;

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

// Add this route to get all active referrals for a platform
router.get('/platform/:platformSlug', async (req, res) => {
  try {
    const { platformSlug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const [referrals, total] = await Promise.all([
      ReferralCode.find({
        platformSlug,
        status: 'ACTIVE'
      })
      .populate('userId', 'displayName profilePicture credibilityScore')
      .sort({ clicks: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
      
      ReferralCode.countDocuments({
        platformSlug,
        status: 'ACTIVE'
      })
    ]);

    res.json({ 
      referralCodes: referrals,
      total,
      page,
      hasMore: total > skip + referrals.length
    });
  } catch (error) {
    console.error('Error fetching platform referrals:', error);
    res.status(500).json({ message: 'Error fetching referrals' });
  }
});

export default router; 