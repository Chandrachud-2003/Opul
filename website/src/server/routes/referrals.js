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
    const platform = await Platform.findOne({ slug: platformSlug });
    if (!platform) {
      return res.status(404).json({ message: 'Platform not found' });
    }

    const referral = new ReferralCode({
      platformId: platform._id,
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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const firebaseUid = req.user.uid;

    // First, find the user by their Firebase UID
    const user = await User.findOne({ uid: firebaseUid }).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'User not found' });
    }

    // Then find the referral code using the user's MongoDB _id
    const referral = await ReferralCode.findOne({ 
      _id: id,
      userId: user._id 
    }).session(session);

    if (!referral) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Referral not found or unauthorized' });
    }

    // 1. Remove reference from Platform
    await Platform.updateOne(
      { _id: referral.platformId },
      { $pull: { referralCodes: referral._id } }
    ).session(session);

    // 2. Remove reference from User
    await User.updateOne(
      { _id: user._id },
      { $pull: { referralCodes: referral._id } }
    ).session(session);

    // 3. Delete the referral code
    await ReferralCode.deleteOne({ _id: id }).session(session);

    await session.commitTransaction();
    res.json({ 
      success: true,
      message: 'Referral code deleted successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error deleting referral:', error);
    res.status(500).json({ message: 'Error deleting referral' });
  } finally {
    session.endSession();
  }
});

// Add this route to get all active referrals for a platform
router.get('/platform/:platformSlug', async (req, res) => {
  try {
    const { platformSlug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    console.log('Fetching referrals for platform:', platformSlug);
    
    const [referrals, total] = await Promise.all([
      ReferralCode.find({
        platformSlug,
        status: 'ACTIVE'
      })
      .populate('userId', 'displayName profilePicture credibilityScore uid')
      .sort({ clicks: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
      
      ReferralCode.countDocuments({
        platformSlug,
        status: 'ACTIVE'
      })
    ]);

    console.log('Referral codes with user data:', referrals.map(ref => ({
      id: ref._id,
      userInfo: {
        id: ref.userId?._id,
        uid: ref.userId?.uid,
        displayName: ref.userId?.displayName
      }
    })));

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

// Add this at the top of the file
const logRequest = (message, data) => {
  console.log('\n' + '='.repeat(80));
  console.log(`[${new Date().toISOString()}] ${message}`);
  if (data) console.log(JSON.stringify(data, null, 2));
  console.log('='.repeat(80) + '\n');
};

router.post('/:id/track-click', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { userId } = req.body;

    logOperation('🎯 PROCESSING CLICK TRACK REQUEST', {
      referralId: id,
      userId: userId || 'Not logged in'
    });

    // Find the referral code
    const referral = await ReferralCode.findById(id).session(session);
    if (!referral) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Referral not found' });
    }

    // Don't increment if the user is clicking their own referral
    if (userId && userId === referral.userId.toString()) {
      await session.abortTransaction();
      return res.status(200).json({ 
        message: 'Own referral click not counted',
        clicks: referral.clicks 
      });
    }

    // Increment clicks and update user stats
    const newClickCount = await referral.incrementClicks();

    await session.commitTransaction();

    res.json({ 
      success: true, 
      clicks: newClickCount,
      message: 'Click count updated successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error tracking click:', error);
    res.status(500).json({ message: 'Error tracking click' });
  } finally {
    session.endSession();
  }
});

export default router; 