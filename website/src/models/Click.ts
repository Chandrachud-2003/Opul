import mongoose, { Document } from 'mongoose';

interface IClick extends Document {
  referralCodeId: mongoose.Types.ObjectId;
  timestamp: Date;
  userAgent?: string;
  ipHash?: string;
  metadata: {
    version: number;
  };
}

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

export const Click = mongoose.model<IClick>('Click', clickSchema); 