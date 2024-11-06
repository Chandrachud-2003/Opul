import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  referralCodeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ReferralCode', 
    required: true 
  },
  timestamp: { type: Date, default: Date.now },
  userAgent: String,
  ipHash: String,
  metadata: {
    version: { type: Number, default: 1 },
  },
});

clickSchema.index({ referralCodeId: 1, timestamp: -1 });
clickSchema.index({ ipHash: 1 });

export const Click = mongoose.model('Click', clickSchema); 