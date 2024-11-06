import mongoose from 'mongoose';

// Enum for referral types
export const ReferralType = {
  CODE: 'code',
  LINK: 'link',
  BOTH: 'both'
};

// Enum for categories
export const PlatformCategory = {
  FINANCE: 'finance',
  TRAVEL: 'travel',
  FOOD: 'food',
  SHOPPING: 'shopping',
  ENTERTAINMENT: 'entertainment',
  TECHNOLOGY: 'technology',
  OTHER: 'other'
};

const validationRulesSchema = new mongoose.Schema({
  minLength: { type: Number, min: 1 },
  maxLength: { type: Number },
  pattern: { type: String },
  format: { type: String },
  case: { 
    type: String,
    enum: ['upper', 'lower', 'any'],
    default: 'any'
  },
  allowedCharacters: { type: String },
  examples: [{ type: String }]
}, { _id: false });

const platformSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Platform name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  slug: { 
    type: String, 
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  category: { 
    type: String,
    enum: Object.values(PlatformCategory),
    required: [true, 'Category is required']
  },
  icon: { 
    type: String,
    required: [true, 'Icon URL is required'],
    validate: {
      validator: function(v) {
        return /^(http|https):\/\/[^ "]+$/.test(v);
      },
      message: 'Icon must be a valid URL'
    }
  },
  description: { 
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  benefitDescription: { 
    type: String,
    required: [true, 'Benefit description is required'],
    minlength: [10, 'Benefit description must be at least 10 characters long'],
    maxlength: [500, 'Benefit description cannot exceed 500 characters']
  },
  claimSteps: { 
    type: [String],
    required: [true, 'Claim steps are required'],
    validate: {
      validator: function(v) {
        return v.length > 0 && v.every(step => step.length >= 5);
      },
      message: 'At least one claim step is required, and each step must be at least 5 characters long'
    }
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  referralType: {
    type: String,
    enum: Object.values(ReferralType),
    required: [true, 'Referral type is required']
  },
  validation: {
    code: validationRulesSchema,
    link: validationRulesSchema
  },
  metadata: {
    lastUpdated: { type: Date, default: Date.now },
    version: { type: Number, default: 1 },
  },
  referralCodes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ReferralCode' 
  }]
}, {
  timestamps: true
});

// Indexes
platformSchema.index({ slug: 1 }, { unique: true });
platformSchema.index({ category: 1 });
platformSchema.index({ name: 'text', description: 'text' });
platformSchema.index({ referralCodes: 1 });

// Pre-save middleware
platformSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  next();
});

// Instance method to validate referral
platformSchema.methods.validateReferral = function(type, value) {
  const rules = this.validation[type];
  if (!rules) {
    return { isValid: false, error: `No validation rules defined for ${type}` };
  }

  if (rules.minLength && value.length < rules.minLength) {
    return { isValid: false, error: `${type} must be at least ${rules.minLength} characters long` };
  }
  if (rules.maxLength && value.length > rules.maxLength) {
    return { isValid: false, error: `${type} must be no more than ${rules.maxLength} characters long` };
  }

  if (rules.pattern) {
    const regex = new RegExp(rules.pattern);
    if (!regex.test(value)) {
      return { isValid: false, error: `${type} format is invalid` };
    }
  }

  if (rules.case === 'upper' && value !== value.toUpperCase()) {
    return { isValid: false, error: `${type} must be in uppercase` };
  }
  if (rules.case === 'lower' && value !== value.toLowerCase()) {
    return { isValid: false, error: `${type} must be in lowercase` };
  }

  return { isValid: true };
};

export const Platform = mongoose.model('Platform', platformSchema); 