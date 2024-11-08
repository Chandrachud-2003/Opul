import { connectToDatabase } from './mongodb';
import { Db, ObjectId } from 'mongodb';

export const createOrUpdateUser = async (firebaseUser: any) => {
  const db = await connectToDatabase();
  const users = db.collection('users');

  const referralCodes = await db.collection('referralCodes')
    .find({ userId: firebaseUser.uid })
    .toArray();

  const totalClicks = referralCodes.reduce((sum, code) => sum + (code.clicks || 0), 0);

  const userData = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    profilePicture: firebaseUser.photoURL,
    lastLoginAt: new Date(),
    credibilityScore: 0,
    isPremium: false,
    stats: {
      totalClicks: totalClicks,
      totalEarnings: 0,
      lastClickedAt: new Date()
    }
  };

  await users.updateOne(
    { uid: firebaseUser.uid },
    { 
      $set: {
        ...userData,
        'stats.totalClicks': totalClicks
      }
    },
    { upsert: true }
  );
};

export const getReferralCodes = async (platformId: string) => {
  const db = await connectToDatabase();
  const codes = await db.collection('referralCodes')
    .find({ platformId, status: 'ACTIVE' })
    .sort({ clicks: -1 })
    .limit(20)
    .toArray();
  
  return codes;
};

export const trackClick = async (referralCodeId: string) => {
  const db = await connectToDatabase();
  const referralCode = await db.collection('referralCodes').findOne({ 
    _id: new ObjectId(referralCodeId) 
  });

  if (referralCode) {
    await db.collection('referralCodes').updateOne(
      { _id: new ObjectId(referralCodeId) },
      { 
        $inc: { clicks: 1 },
        $set: { lastClickedAt: new Date() }
      }
    );

    await db.collection('users').updateOne(
      { uid: referralCode.userId },
      { 
        $inc: { 'stats.totalClicks': 1 },
        $set: { 'stats.lastClickedAt': new Date() }
      }
    );
  }
}; 