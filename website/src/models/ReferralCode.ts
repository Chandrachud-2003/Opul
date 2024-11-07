import mongoose, { Document } from 'mongoose';

type SourceType = 'SCRAPED' | 'USER_SUBMITTED';
type StatusType = 'ACTIVE' | 'EXPIRED' | 'BLOCKED';

interface IFeedback {
  userId: mongoose.Types.ObjectId;
  isSuccess: boolean;
  comment?: string;
  createdAt: Date;
}

interface IReferralCode extends Document {
  platformSlug: string;
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
  feedback: IFeedback[];
}

const feedbackSchema = new mongoose.Schema<IFeedback>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isSuccess: { type: Boolean, required: true },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const referralCodeSchema = new mongoose.Schema({
  platformSlug: { 
    type: String, 
    ref: 'Platform', 
    required: true,
    index: true 
  },
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

referralCodeSchema.index({ platformSlug: 1, status: 1, clicks: -1 });
referralCodeSchema.index({ userId: 1, status: 1 });

export const ReferralCode = mongoose.model<IReferralCode>('ReferralCode', referralCodeSchema); 