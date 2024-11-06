import mongoose, { Document } from 'mongoose';

interface IPlatform extends Document {
  name: string;
  slug: string;
  category?: string;
  icon?: string;
  description?: string;
  benefitDescription?: string;
  claimSteps: string[];
  isActive: boolean;
  metadata: {
    lastUpdated: Date;
    version: number;
  };
  referralCodes: mongoose.Types.ObjectId[]; // References to ReferralCode
}

const platformSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: String,
  icon: String,
  description: String,
  benefitDescription: String,
  claimSteps: [String],
  isActive: { type: Boolean, default: true },
  metadata: {
    lastUpdated: { type: Date, default: Date.now },
    version: { type: Number, default: 1 },
  },
  referralCodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReferralCode' }],
});

platformSchema.index({ slug: 1 }, { unique: true });
platformSchema.index({ category: 1 });
platformSchema.index({ name: 'text', description: 'text' });
platformSchema.index({ referralCodes: 1 });

export const Platform = mongoose.model<IPlatform>('Platform', platformSchema); 