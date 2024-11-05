import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: String,
  profilePicture: String,
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: Date,
  credibilityScore: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false },
  premiumExpiry: Date,
  stats: {
    totalClicks: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    lastClickedAt: Date,
  },
  metadata: {
    lastUpdated: { type: Date, default: Date.now },
    version: { type: Number, default: 1 },
  },
});

export default mongoose.model('User', userSchema); 