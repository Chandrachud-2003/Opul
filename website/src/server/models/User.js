import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
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
  feedbackStats: {
    positive: { type: Number, default: 0 },
    negative: { type: Number, default: 0 },
  },
  referralCodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReferralCode' }],
});

userSchema.index({ uid: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ credibilityScore: -1 });
userSchema.index({ referralCodes: 1 });

export const User = mongoose.model('User', userSchema); 