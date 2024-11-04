import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: String,
  profilePicture: String,
  credibilityScore: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false },
  // ... other fields as per your schema
}, { timestamps: true });

userSchema.index({ firebaseUid: 1 });
userSchema.index({ credibilityScore: -1 });

export const User = mongoose.model('User', userSchema); 