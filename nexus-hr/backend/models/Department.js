const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String },
    head: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

departmentSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('Department', departmentSchema);
