const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    reviewPeriod: { type: String, required: true }, // e.g. "2026-Q2"
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    score: { type: Number, min: 0, max: 100, required: true },
    goals: [{ title: String, achieved: Boolean }],
    strengths: [{ type: String }],
    improvementAreas: [{ type: String }],
    comments: { type: String },
  },
  { timestamps: true }
);

performanceSchema.index({ employee: 1, reviewPeriod: 1 }, { unique: true });

module.exports = mongoose.model('Performance', performanceSchema);
