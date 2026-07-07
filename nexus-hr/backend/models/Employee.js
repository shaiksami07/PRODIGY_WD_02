const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  { degree: String, institution: String, year: Number },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  { company: String, role: String, from: Date, to: Date, description: String },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['resume', 'id_proof', 'offer_letter', 'other'] },
    url: String,
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const employeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, unique: true }, // auto-generated, e.g. EMP-00001
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // Personal
    fullName: { type: String, required: true, trim: true },
    photo: { type: String },
    gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
    dob: { type: Date },
    bloodGroup: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    alternatePhone: { type: String },
    emergencyContact: { name: String, phone: String, relation: String },
    address: {
      line1: String,
      country: String,
      state: String,
      city: String,
      pincode: String,
    },

    // Employment
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    designation: { type: mongoose.Schema.Types.ObjectId, ref: 'Designation', required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    joiningDate: { type: Date, required: true },
    employmentType: {
      type: String,
      enum: ['full_time', 'part_time', 'contract', 'intern'],
      default: 'full_time',
    },
    workLocation: { type: String, enum: ['onsite', 'remote', 'hybrid'], default: 'onsite' },
    salary: { type: Number, required: true, min: 0 },
    bankDetails: { accountNumber: String, ifsc: String, bankName: String },
    aadharNumber: { type: String, select: false },
    panNumber: { type: String, select: false },

    // Profile
    skills: [{ type: String }],
    languages: [{ type: String }],
    education: [educationSchema],
    experience: [experienceSchema],
    certificates: [{ name: String, url: String }],
    socialLinks: { linkedin: String, github: String, portfolio: String },
    documents: [documentSchema],
    notes: { type: String },

    status: {
      type: String,
      enum: ['active', 'inactive', 'on_leave', 'terminated', 'resigned'],
      default: 'active',
    },
    isArchived: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

employeeSchema.index({ department: 1, designation: 1 });
employeeSchema.index({ status: 1, isDeleted: 1 });
employeeSchema.index({ fullName: 'text', email: 'text' });

// Profile completion percentage (virtual, computed on the fly)
employeeSchema.virtual('profileCompletion').get(function profileCompletion() {
  const fields = [
    this.photo,
    this.dob,
    this.bloodGroup,
    this.address && this.address.line1,
    this.bankDetails && this.bankDetails.accountNumber,
    this.skills && this.skills.length,
    this.education && this.education.length,
    this.documents && this.documents.length,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
});
employeeSchema.set('toJSON', { virtuals: true });
employeeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Employee', employeeSchema);
