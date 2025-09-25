
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // User and Vehicle References
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: function() {
      return this.paymentFlag === 0 || this.paymentFlag === 2; // Required for new tag and trips
    }
  },
  personalDetailsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetails',
    required: function() {
      return this.paymentFlag === 0; // Required for new tag
    }
  },

  // Payment Basic Info
  paymentId: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      return 'PAY_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true // Allow null but ensure uniqueness when present
  },
  
  // Payment Flag (0: New Tag, 1: Recharge, 2: Trips)
  paymentFlag: {
    type: Number,
    enum: [0, 1, 2],
    required: true,
    validate: {
      validator: function(v) {
        return [0, 1, 2].includes(v);
      },
      message: 'Payment flag must be 0 (New Tag), 1 (Recharge), or 2 (Trips)'
    }
  },

  // Amount and Currency
  amount: {
    type: Number,
    required: true,
    min: [1, 'Amount must be greater than 0']
  },
  currency: {
    type: String,
    default: 'INR'
  },

  // Vehicle Information (for logging)
  vehicleInfo: {
    registrationNumber: {
      type: String,
      required: function() {
        return this.paymentFlag === 0 || this.paymentFlag === 2;
      }
    },
    vehicleType: {
      type: String,
      required: function() {
        return this.paymentFlag === 0;
      }
    },
    model: String,
    chassisNumber: String,
    engineNumber: String
  },

  // Personal Information (for logging)
  personalInfo: {
    fullName: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    email: String,
    panNumber: String,
    aadharNumber: String
  },

  // UPI Payment Details
  upiDetails: {
    upiId: String,
    payerVPA: String, // Virtual Payment Address of payer
    payeeVPA: String, // Virtual Payment Address of payee (your UPI ID)
    merchantId: String,
    merchantTransactionId: String,
    qrCode: String, // Generated QR code for payment
    deepLink: String // UPI deep link for mobile apps
  },

  // Payment Status
  paymentStatus: {
    type: String,
    enum: ['pending', 'initiated', 'success', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  
  // Payment Method
  paymentMethod: {
    type: String,
    enum: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'],
    default: 'UPI'
  },

  // Timestamps
  initiatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    }
  },

  // Response from Payment Gateway
  gatewayResponse: {
    responseCode: String,
    responseMessage: String,
    gatewayTransactionId: String,
    bankTransactionId: String,
    signature: String,
    additionalInfo: mongoose.Schema.Types.Mixed
  },

  // Refund Information
  refundInfo: {
    refundId: String,
    refundAmount: Number,
    refundReason: String,
    refundStatus: {
      type: String,
      enum: ['pending', 'success', 'failed']
    },
    refundedAt: Date
  },

  // Trip specific details (when paymentFlag = 2)
  tripDetails: {
    tollPlazaName: String,
    tollAmount: Number,
    entryTime: Date,
    exitTime: Date,
    distance: Number,
    routeInfo: String
  },

  // Recharge specific details (when paymentFlag = 1)
  rechargeDetails: {
    fastTagId: String,
    previousBalance: Number,
    rechargeAmount: Number,
    newBalance: Number,
    bonusAmount: {
      type: Number,
      default: 0
    }
  },

  // Additional metadata
  metadata: {
    ipAddress: String,
    userAgent: String,
    deviceInfo: String,
    appVersion: String,
    source: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    }
  },

  // Admin notes and internal tracking
  internalNotes: String,
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  // Add indexes for better query performance
  indexes: [
    { paymentId: 1 },
    { userId: 1, paymentFlag: 1 },
    { 'vehicleInfo.registrationNumber': 1 },
    { paymentStatus: 1 },
    { createdAt: -1 }
  ]
});

// Pre-save middleware to set completion time
paymentSchema.pre('save', function(next) {
  if (this.isModified('paymentStatus') && this.paymentStatus === 'success' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

// Virtual for payment type description
paymentSchema.virtual('paymentTypeDescription').get(function() {
  switch(this.paymentFlag) {
    case 0: return 'New FastTag Application';
    case 1: return 'FastTag Recharge';
    case 2: return 'Toll Trip Payment';
    default: return 'Unknown';
  }
});

// Instance method to generate UPI payment string
paymentSchema.methods.generateUpiPaymentString = function() {
  const { upiDetails, amount, paymentId } = this;
  if (!upiDetails.payeeVPA) return null;
  
  // UPI Payment URL format
  const upiString = `upi://pay?pa=${upiDetails.payeeVPA}&pn=FastTag&mc=0000&tid=${paymentId}&tr=${paymentId}&tn=FastTag Payment&am=${amount}&cu=INR`;
  return upiString;
};

// Static method to get payments by flag
paymentSchema.statics.getPaymentsByFlag = function(flag, userId = null) {
  const query = { paymentFlag: flag };
  if (userId) query.userId = userId;
  
  return this.find(query)
    .populate('userId', 'name email mobile')
    .populate('vehicleId', 'registrationNumber vehicleType model')
    .populate('personalDetailsId', 'fullName panNumber')
    .sort({ createdAt: -1 });
};

// Static method to get payment statistics
paymentSchema.statics.getPaymentStats = function(userId = null) {
  const matchStage = userId ? { $match: { userId: mongoose.Types.ObjectId(userId) } } : { $match: {} };
  
  return this.aggregate([
    matchStage,
    {
      $group: {
        _id: '$paymentFlag',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        successfulPayments: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'success'] }, 1, 0] }
        },
        totalSuccessAmount: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'success'] }, '$amount', 0] }
        }
      }
    },
    {
      $project: {
        paymentType: {
          $switch: {
            branches: [
              { case: { $eq: ['$_id', 0] }, then: 'New Tag' },
              { case: { $eq: ['$_id', 1] }, then: 'Recharge' },
              { case: { $eq: ['$_id', 2] }, then: 'Trips' }
            ],
            default: 'Unknown'
          }
        },
        totalAmount: 1,
        count: 1,
        successfulPayments: 1,
        totalSuccessAmount: 1,
        successRate: {
          $round: [{ $multiply: [{ $divide: ['$successfulPayments', '$count'] }, 100] }, 2]
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Payment', paymentSchema);