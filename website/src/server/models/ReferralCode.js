import mongoose from 'mongoose';

const referralCodeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platformId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Platform',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  referralLink: {
    type: String,
    required: true
  },
  clicks: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('ReferralCode', referralCodeSchema); 