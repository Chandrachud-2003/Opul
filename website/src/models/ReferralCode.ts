import mongoose, { Document } from 'mongoose';

type SourceType = 'SCRAPED' | 'USER_SUBMITTED';
type StatusType = 'ACTIVE' | 'EXPIRED' | 'BLOCKED';

interface IReferralCode extends Document {
  platformId: mongoose.Types.ObjectId;
  code?: string;
  referralLink?: string;
  sourceType: SourceType;
  sourceUrl?: string;
  userId?: mongoose.Types.ObjectId;
  status: StatusType;
  clicks: number;
  lastClickedAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
  metadata: {
    lastVerified?: Date;
    lastUpdated: Date;
    version: number;
  };
}

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
});

referralCodeSchema.index({ platformId: 1, status: 1 });
referralCodeSchema.index({ userId: 1 });
referralCodeSchema.index({ clicks: -1 });
referralCodeSchema.index({ createdAt: -1 });

export const ReferralCode = mongoose.model<IReferralCode>('ReferralCode', referralCodeSchema); 