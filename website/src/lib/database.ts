import { connectToDatabase } from './mongodb';

export const createOrUpdateUser = async (firebaseUser: any) => {
  const db = await connectToDatabase();
  const users = db.collection('users');

  const userData = {
    firebaseUid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    profilePicture: firebaseUser.photoURL,
    lastLoginAt: new Date(),
    credibilityScore: 0,
    isPremium: false,
    stats: {
      totalClicks: 0,
      totalEarnings: 0
    }
  };

  await users.updateOne(
    { firebaseUid: firebaseUser.uid },
    { $set: userData },
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
  await db.collection('referralCodes').updateOne(
    { _id: referralCodeId },
    { 
      $inc: { clicks: 1 },
      $set: { lastClickedAt: new Date() }
    }
  );
}; 