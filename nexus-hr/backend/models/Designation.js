const mongoose = require('mongoose');

const designationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    level: { type: Number, default: 1 }, // seniority level, used for org-chart ordering
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

designationSchema.index({ title: 1, department: 1 }, { unique: true });

module.exports = mongoose.model('Designation', designationSchema);
