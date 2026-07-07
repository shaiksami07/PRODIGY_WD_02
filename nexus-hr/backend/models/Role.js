const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ['super_admin', 'admin', 'hr', 'manager', 'employee', 'viewer'],
    },
    label: { type: String, required: true },
    permissions: [{ type: String }], // e.g. 'employee:create', 'employee:delete'
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Role', roleSchema);
