const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const env = require('../config/env');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'hr', 'manager', 'employee', 'viewer'],
      default: 'employee',
    },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    passwordChangedAt: { type: Date },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    refreshTokenHash: { type: String, select: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ isDeleted: 1 });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, env.bcryptSaltRounds);
  if (!this.isNew) this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.changedPasswordAfter = function changedPasswordAfter(jwtTimestamp) {
  if (!this.passwordChangedAt) return false;
  const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
  return jwtTimestamp < changedTimestamp;
};

module.exports = mongoose.model('User', userSchema);
