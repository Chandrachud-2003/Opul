import mongoose, { Document } from 'mongoose';

// Enum for referral types
export enum ReferralType {
  CODE = 'code',
  LINK = 'link',
  BOTH = 'both'
}

// Enum for categories
export enum PlatformCategory {
  FINANCE = 'finance',
  TRAVEL = 'travel',
  FOOD = 'food',
  SHOPPING = 'shopping',
  ENTERTAINMENT = 'entertainment',
  TECHNOLOGY = 'technology',
  OTHER = 'other'
}

interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
  case?: 'upper' | 'lower' | 'any';
  allowedCharacters?: string;
  examples?: string[];
}

interface IPlatform extends Document {
  name: string;
  slug: string;
  category: PlatformCategory;  // Now required
  icon: string;               // Now required
  description: string;        // Now required
  benefitDescription: string; // Now required
  claimSteps: string[];      // Now required and must have at least one step
  isActive: boolean;
  referralType: ReferralType;
  validation: {
    code?: ValidationRules;
    link?: ValidationRules;
  };
  metadata: {
    lastUpdated: Date;
    version: number;
  };
  referralCodes: mongoose.Types.ObjectId[];
}

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
      validator: function(v: string) {
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
      validator: function(v: string[]) {
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
  timestamps: true // Adds createdAt and updatedAt fields
});

// Indexes
platformSchema.index({ slug: 1 }, { unique: true });
platformSchema.index({ category: 1 });
platformSchema.index({ name: 'text', description: 'text' });
platformSchema.index({ referralCodes: 1 });

// Pre-save middleware to generate slug if not provided
platformSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  next();
});

// Instance method to validate a referral code or link
platformSchema.methods.validateReferral = function(type: 'code' | 'link', value: string): { isValid: boolean; error?: string } {
  const rules = this.validation[type];
  if (!rules) {
    return { isValid: false, error: `No validation rules defined for ${type}` };
  }

  // Check length
  if (rules.minLength && value.length < rules.minLength) {
    return { isValid: false, error: `${type} must be at least ${rules.minLength} characters long` };
  }
  if (rules.maxLength && value.length > rules.maxLength) {
    return { isValid: false, error: `${type} must be no more than ${rules.maxLength} characters long` };
  }

  // Check pattern
  if (rules.pattern) {
    const regex = new RegExp(rules.pattern);
    if (!regex.test(value)) {
      return { isValid: false, error: `${type} format is invalid` };
    }
  }

  // Check case
  if (rules.case === 'upper' && value !== value.toUpperCase()) {
    return { isValid: false, error: `${type} must be in uppercase` };
  }
  if (rules.case === 'lower' && value !== value.toLowerCase()) {
    return { isValid: false, error: `${type} must be in lowercase` };
  }

  return { isValid: true };
};

export const Platform = mongoose.model<IPlatform>('Platform', platformSchema);

// Example usage:
/*
const platform = await Platform.create({
  name: "Uber",
  category: PlatformCategory.TRAVEL,
  icon: "https://example.com/uber-icon.png",
  description: "Uber is a ride-hailing platform that connects drivers with passengers.",
  benefitDescription: "Get $15 off your first ride when using a referral code.",
  claimSteps: [
    "Download the Uber app from App Store or Google Play",
    "Create a new account",
    "Enter the referral code in the 'Promotions' section",
    "Your discount will be automatically applied to your first ride"
  ],
  referralType: ReferralType.CODE,
  validation: {
    code: {
      minLength: 8,
      maxLength: 8,
      pattern: "^[A-Z0-9]{8}$",
      case: "upper",
      allowedCharacters: "A-Z0-9",
      format: "XXXXXXXX",
      examples: ["UBER2024"]
    }
  }
});

// Validate the platform
try {
  await platform.validate();
} catch (error) {
  console.error('Validation errors:', error.errors);
}
*/