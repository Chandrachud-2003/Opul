import express from 'express';
import { User } from '../models/User.js';
import { ReferralCode } from '../models/ReferralCode.js';

const logOperation = (message, data) => {
  console.log('\n' + '-'.repeat(60));
  console.log(`[${new Date().toISOString()}] ${message}`);
  if (data) console.log(JSON.stringify(data, null, 2));
  console.log('-'.repeat(60) + '\n');
};

const router = express.Router();

router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const { includeStats } = req.query;
    
    let user = await User.findOne({ uid: identifier });
    if (!user) {
      user = await User.findOne({ email: identifier });
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all active referral codes for the user
    const referralCodes = await ReferralCode.find({
      userId: user._id,
      status: 'ACTIVE'
    })
    .populate({
      path: 'platformId',
      select: 'name icon benefitLogline category slug'
    })
    .sort({ clicks: -1 })
    .limit(10)
    .lean();

    // Calculate total clicks from all referral codes
    const totalClicks = referralCodes.reduce((sum, code) => sum + (code.clicks || 0), 0);

    const response = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      credibilityScore: user.credibilityScore || 0,
      isPremium: user.isPremium || false,
      stats: {
        totalClicks: totalClicks, // Use the calculated total
        totalReferrals: referralCodes.length,
        lastClickedAt: user.stats?.lastClickedAt || null
      },
      referralCodes: referralCodes.map(code => ({
        id: code._id,
        platform: {
          name: code.platformId?.name,
          logo: code.platformId?.icon,
          category: code.platformId?.category,
          benefitLogline: code.platformId?.benefitLogline,
          slug: code.platformId?.slug
        },
        code: code.code,
        referralLink: code.referralLink,
        clicks: code.clicks || 0,
        status: code.status
      }))
    };

    res.json(response);
  } catch (error) {
    console.error('Error in /:identifier:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new route to fetch more referrals
router.get('/:identifier/referrals', async (req, res) => {
  try {
    const { identifier } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const user = await User.findOne({ uid: identifier });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const referralCodes = await ReferralCode.find({
      userId: user._id,
      status: 'ACTIVE'
    })
    .populate({
      path: 'platformId',
      select: 'name icon benefitLogline category slug'
    })
    .sort({ clicks: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

    // Add debug logging
    console.log('Referral codes from database:', referralCodes.map(code => ({
      id: code._id,
      platformId: code.platformId,
      platformSlug: code.platformId?.slug,
      platformName: code.platformId?.name
    })));

    const totalCount = await ReferralCode.countDocuments({
      userId: user._id,
      status: 'ACTIVE'
    });

    res.json({
      referralCodes: referralCodes.map(code => ({
        id: code._id,
        platform: {
          name: code.platformId.name,
          logo: code.platformId.icon,
          category: code.platformId.category,
          benefitLogline: code.platformId.benefitLogline,
          slug: code.platformId.slug
        },
        code: code.code,
        referralLink: code.referralLink,
        clicks: code.clicks || 0,
        status: code.status
      })),
      hasMore: totalCount > skip + referralCodes.length,
      total: totalCount
    });
  } catch (error) {
    console.error('Error fetching user referrals:', error);
    res.status(500).json({ message: 'Error fetching referrals' });
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