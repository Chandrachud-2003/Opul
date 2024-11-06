import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isSuccess: { type: Boolean, required: true },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const referralCodeSchema = new mongoose.Schema({
  platformId: { type: mongoose.Schema.Types.ObjectId, ref: 'Platform', required: true },
  code: String,
  referralLink: String,
  sourceType: { 
    type: String, 
    enum: ['SCRAPED', 'USER_SUBMITTED'], 
    required: true 
  },
  sourceUrl: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'EXPIRED', 'BLOCKED'], 
    default: 'ACTIVE' 
  },
  clicks: { type: Number, default: 0 },
  lastClickedAt: Date,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
  metadata: {
    lastVerified: Date,
    lastUpdated: { type: Date, default: Date.now },
    version: { type: Number, default: 1 },
  },
  feedback: [feedbackSchema],
});

referralCodeSchema.index({ platformId: 1, status: 1, clicks: -1 });
referralCodeSchema.index({ userId: 1, status: 1 });

export const ReferralCode = mongoose.model('ReferralCode', referralCodeSchema); 