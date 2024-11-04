// src/pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/models/User';
import { connectDB } from '@/lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const { firebaseUid, email, displayName, profilePicture } = req.body;

    // Find or create user
    const existingUser = await User.findOne({ firebaseUid });
    
    if (existingUser) {
      // Update last login time for existing user
      await User.findOneAndUpdate(
        { firebaseUid },
        {
          lastLoginAt: new Date(),
          'metadata.lastUpdated': new Date(),
          // Update other fields if needed
          displayName,
          profilePicture,
        }
      );
    } else {
      // Create new user
      const newUser = new User({
        firebaseUid,
        email,
        displayName,
        profilePicture,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        credibilityScore: 0,
        isPremium: false,
        stats: {
          totalClicks: 0,
          totalEarnings: 0,
        },
        metadata: {
          lastUpdated: new Date(),
          version: 1,
        },
      });
      await newUser.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}