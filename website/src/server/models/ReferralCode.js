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

// Add this at the top of the file
const logOperation = (message, data) => {
  console.log('\n' + '-'.repeat(60));
  console.log(`[${new Date().toISOString()}] ${message}`);
  if (data) console.log(JSON.stringify(data, null, 2));
  console.log('-'.repeat(60) + '\n');
};

// Update the incrementClicks method
referralCodeSchema.methods.incrementClicks = async function() {
  const previousClicks = this.clicks;
  this.clicks = (this.clicks || 0) + 1;
  this.lastClickedAt = new Date();
  
  logOperation('📊 INCREMENTING CLICKS', {
    referralId: this._id,
    previousCount: previousClicks,
    newCount: this.clicks,
    timestamp: this.lastClickedAt
  });
  
  // Update user stats
  const user = await mongoose.model('User').findById(this.userId);
  if (user) {
    user.stats.totalClicks = (user.stats.totalClicks || 0) + 1;
    user.stats.lastClickedAt = new Date();
    await user.save();
    
    logOperation('👤 USER STATS UPDATED', {
      userId: user._id,
      totalClicks: user.stats.totalClicks,
      lastClickedAt: user.stats.lastClickedAt
    });
  }
  
  await this.save();
  
  logOperation('💾 DATABASE UPDATE COMPLETE', {
    referralId: this._id,
    finalCount: this.clicks,
    timestamp: new Date().toISOString()
  });
  
  return this.clicks;
};

export const ReferralCode = mongoose.model('ReferralCode', referralCodeSchema); 