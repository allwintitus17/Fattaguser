const mongoose = require('mongoose');

const personalDetailsSchema = new mongoose.Schema({
  authUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Make sure this matches your actual auth collection
    required: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  aadharNumber: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{4}-\d{4}$/, 'Aadhar format must be XXXX-XXXX-XXXX']
  },
  panNumber: {
    type: String,
    required: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format']
  },
  address: {
    line1: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, 'Invalid Pincode']
    }
  },
  photoUrl: {
    type: String,
    default: '/uploads/default.jpg'
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'verified'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserDetails', personalDetailsSchema);
