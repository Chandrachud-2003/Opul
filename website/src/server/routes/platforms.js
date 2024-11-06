import express from 'express';
import { Platform } from '../models/Platform.js';

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
      .select('name icon description benefitDescription category')
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

export default router; 