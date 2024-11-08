import mongoose from 'mongoose';

const referralCodeSchema = new mongoose.Schema({
  platformId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Platform',
    required: true
  },
  platformSlug: {
    type: String,
    required: [true, 'Platform slug is required'],
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: String,
  referralLink: String,
  clicks: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'EXPIRED', 'DELETED'],
    default: 'ACTIVE'
  },
  sourceType: {
    type: String,
    enum: ['USER_SUBMITTED', 'SYSTEM_GENERATED'],
    required: true
  },
  metadata: {
    lastUpdated: { type: Date, default: Date.now },
    version: { type: Number, default: 1 }
  }
}, {
  timestamps: true
});

// Ensure either code or referralLink is provided
referralCodeSchema.pre('save', function(next) {
  if (!this.code && !this.referralLink) {
    next(new Error('Either code or referralLink must be provided'));
  }
  next();
});

// Add indexes
referralCodeSchema.index({ platformSlug: 1, status: 1 });
referralCodeSchema.index({ userId: 1, status: 1 });
referralCodeSchema.index({ clicks: -1 });

export const ReferralCode = mongoose.model('ReferralCode', referralCodeSchema); 