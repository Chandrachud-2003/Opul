import express from 'express';
import { Platform } from '../models/Platform.js';
import { ReferralCode } from '../models/ReferralCode.js';

const router = express.Router();

// Get platforms with search, filters and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 30, 
      search, 
      category 
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      // Escape special regex characters and normalize unicode
      const sanitizedSearch = search
        .normalize('NFKC')
        .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      
      query.$or = [
        { name: { $regex: `^${sanitizedSearch}$`, $options: 'i' } },
        { description: { $regex: sanitizedSearch, $options: 'i' } }
      ];
    }

    const platforms = await Platform.find(query)
      .select('name icon description benefitDescription benefitLogline category slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Platform.countDocuments(query);

    res.json({ 
      platforms,
      total,
      hasMore: total > skip + platforms.length
    });
  } catch (error) {
    console.error('Error fetching platforms:', error);
    res.status(500).json({ 
      message: 'Error fetching platforms', 
      error: error.message 
    });
  }
});

// Add the slug route BEFORE the ID route
router.get('/slug/:slug', async (req, res) => {
  try {
    console.log('Fetching platform with slug:', req.params.slug);
    const platform = await Platform.findOne({ 
      slug: req.params.slug,
      isActive: true
    })
    .select('-validation -metadata')
    .lean();
      
    if (!platform) {
      console.log('Platform not found for slug:', req.params.slug);
      return res.status(404).json({ message: 'Platform not found' });
    }

    console.log('Found platform:', platform);
    // Fetch first 20 referral codes
    const referralCodes = await ReferralCode.find({ 
      platformId: platform._id,
      status: 'ACTIVE'
    })
    .sort({ clicks: -1 })
    .limit(20)
    .populate('userId', 'displayName profilePicture credibilityScore')
    .lean();

    // Get total count for pagination
    const totalCodes = await ReferralCode.countDocuments({
      platformId: platform._id,
      status: 'ACTIVE'
    });

    res.json({
      platform,
      referralCodes,
      hasMore: totalCodes > referralCodes.length,
      total: totalCodes
    });
  } catch (error) {
    console.error('Error fetching platform:', error);
    res.status(500).json({ message: 'Error fetching platform details' });
  }
});

// Get platform by ID with referral codes
router.get('/:id', async (req, res) => {
  try {
    const platform = await Platform.findById(req.params.id)
      .select('-validation -metadata')
      .lean();
      
    if (!platform) {
      return res.status(404).json({ message: 'Platform not found' });
    }

    // Fetch first 20 referral codes
    const referralCodes = await ReferralCode.find({ 
      platformId: platform._id,
      status: 'ACTIVE'
    })
    .sort({ clicks: -1 })
    .limit(20)
    .populate('userId', 'displayName profilePicture')
    .lean();

    // Get total count for pagination
    const totalCodes = await ReferralCode.countDocuments({
      platformId: platform._id,
      status: 'ACTIVE'
    });

    res.json({
      platform,
      referralCodes,
      hasMore: totalCodes > referralCodes.length,
      total: totalCodes
    });
  } catch (error) {
    console.error('Error fetching platform:', error);
    res.status(500).json({ message: 'Error fetching platform details' });
  }
});

// Add this new route
router.get('/:id/validation', async (req, res) => {
  try {
    const platform = await Platform.findById(req.params.id)
      .select('validation referralType')
      .lean();
      
    if (!platform) {
      return res.status(404).json({ message: 'Platform not found' });
    }

    res.json({
      validation: platform.validation,
      referralType: platform.referralType
    });
  } catch (error) {
    console.error('Error fetching platform validation:', error);
    res.status(500).json({ message: 'Error fetching platform validation' });
  }
});

// Add this new route before the existing routes
router.get('/:slug/related', async (req, res) => {
  try {
    const platform = await Platform.findOne({ slug: req.params.slug });
    if (!platform) {
      return res.status(404).json({ message: 'Platform not found' });
    }

    const relatedPlatforms = await Platform.find({
      category: platform.category,
      slug: { $ne: platform.slug }, // Exclude current platform
      isActive: true
    })
    .select('name icon benefitLogline slug')
    .limit(2)
    .lean();

    res.json({ relatedPlatforms });
  } catch (error) {
    console.error('Error fetching related platforms:', error);
    res.status(500).json({ message: 'Error fetching related platforms' });
  }
});

export default router; 
