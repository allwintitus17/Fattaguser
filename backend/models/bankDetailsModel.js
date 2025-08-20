// models/bankDetailsModel.js
const mongoose = require('mongoose');

const bankDetailsSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountHolderName: {
    type: String,
    required: true,
    trim: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{9,18}$/, 'Account number must be 9-18 digits']
  },
  confirmAccountNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return value === this.accountNumber;
      },
      message: 'Account numbers do not match'
    }
  },
  ifscCode: {
    type: String,
    required: true,
    match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format']
  },
  bankName: {
    type: String,
    required: true,
    enum: [
      'State Bank of India',
      'HDFC Bank',
      'ICICI Bank',
      'Axis Bank',
      'Kotak Mahindra Bank',
      'Punjab National Bank',
      'Bank of Baroda',
      'Canara Bank',
      'Union Bank of India',
      'Bank of India',
      'Central Bank of India',
      'Indian Bank',
      'IDBI Bank',
      'Federal Bank',
      'South Indian Bank',
      'Karnataka Bank',
      'Karur Vysya Bank',
      'City Union Bank',
      'DCB Bank',
      'RBL Bank',
      'IndusInd Bank',
      'YES Bank',
      'IDFC First Bank',
      'Bandhan Bank',
      'CSB Bank',
      'Equitas Small Finance Bank',
      'Ujjivan Small Finance Bank',
      'AU Small Finance Bank',
      'Jana Small Finance Bank',
      'Capital Small Finance Bank',
      'ESAF Small Finance Bank',
      'North East Small Finance Bank',
      'Suryoday Small Finance Bank',
      'Utkarsh Small Finance Bank',
      'Fincare Small Finance Bank'
    ]
  },
  branchName: {
    type: String,
    trim: true
  },
  upiId: {
    type: String,
    match: [/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-]{2,64}$/, 'Invalid UPI ID format'],
    sparse: true // Allows multiple null values
  },
  linkedMobileNumber: {
    type: String,
    required: true,
    match: [/^[6-9]\d{9}$/, 'Invalid mobile number format']
  },
  accountType: {
    type: String,
    required: true,
    enum: ['Savings', 'Current', 'Salary', 'NRI', 'Joint']
  },
  consentToDebit: {
    type: Boolean,
    required: true,
    validate: {
      validator: function(value) {
        return value === true;
      },
      message: 'Consent to debit is required'
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Remove confirmAccountNumber from the saved document
bankDetailsSchema.pre('save', function(next) {
  this.confirmAccountNumber = undefined;
  next();
});

module.exports = mongoose.model('BankDetails', bankDetailsSchema);