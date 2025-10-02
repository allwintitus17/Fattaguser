const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  // Unique FastTag ID (randomly generated)
  tagId: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      // Generate random FastTag ID: FT + 12 digits
      const randomNum = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
      return 'FT' + randomNum;
    }
  },
  
  // References to other models
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  personalDetailsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetails',
    required: true
  },

  // FastTag Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked', 'expired'],
    default: 'active'
  },
  
  // Balance Information
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  minimumBalance: {
    type: Number,
    default: 100 // Minimum balance threshold
  },
  
  // FastTag Details
  issueDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    default: function() {
      // FastTag expires after 5 years
      return new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000);
    }
  },
  
  // Vehicle Information (copied for quick access)
  vehicleInfo: {
    registrationNumber: {
      type: String,
      required: true
    },
    vehicleType: {
      type: String,
      required: true
    },
    model: String,
    chassisNumber: String,
    engineNumber: String
  },
  
  // Personal Information (copied for quick access)
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
  
  // Transaction History
  transactionHistory: [{
    type: {
      type: String,
      enum: ['recharge', 'debit', 'refund', 'bonus'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: String,
    balanceAfter: Number,
    tollPlaza: String,
    transactionDate: {
      type: Date,
      default: Date.now
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    }
  }],
  
  // Usage Statistics
  statistics: {
    totalRecharges: {
      type: Number,
      default: 0
    },
    totalRechargeAmount: {
      type: Number,
      default: 0
    },
    totalTrips: {
      type: Number,
      default: 0
    },
    totalTollAmount: {
      type: Number,
      default: 0
    },
    lastUsed: Date
  },
  
  // Security Features
  security: {
    isBlocked: {
      type: Boolean,
      default: false
    },
    blockReason: String,
    blockedAt: Date,
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Metadata
  metadata: {
    deviceInfo: String,
    appVersion: String,
    source: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    }
  }
}, {
  timestamps: true,
  // Add indexes for better query performance
  indexes: [
    { tagId: 1 },
    { userId: 1 },
    { vehicleId: 1 },
    { 'vehicleInfo.registrationNumber': 1 },
    { status: 1 },
    { createdAt: -1 }
  ]
});

// Virtual for formatted tag ID display
tagSchema.virtual('formattedTagId').get(function() {
  if (!this.tagId) return '';
  // Format as FT-XXXX-XXXX-XXXX
  return this.tagId.replace(/^FT(\d{4})(\d{4})(\d{4})$/, 'FT-$1-$2-$3');
});

// Virtual for balance status
tagSchema.virtual('balanceStatus').get(function() {
  if (this.balance <= 0) return 'zero';
  if (this.balance < this.minimumBalance) return 'low';
  return 'sufficient';
});

// Instance method to add transaction
tagSchema.methods.addTransaction = function(type, amount, description, tollPlaza = null, paymentId = null) {
  const transaction = {
    type,
    amount,
    description,
    balanceAfter: this.balance,
    tollPlaza,
    transactionDate: new Date()
  };
  
  this.transactionHistory.push(transaction);
  
  // Update statistics
  if (type === 'recharge') {
    this.statistics.totalRecharges += 1;
    this.statistics.totalRechargeAmount += amount;
  } else if (type === 'debit') {
    this.statistics.totalTrips += 1;
    this.statistics.totalTollAmount += amount;
    this.statistics.lastUsed = new Date();
  }
  
  return this.save();
};

// Instance method to recharge balance
tagSchema.methods.recharge = function(amount, description = 'Balance recharge', paymentId = null) {
  this.balance += amount;
  return this.addTransaction('recharge', amount, description, null, paymentId);
};

// Instance method to debit balance
tagSchema.methods.debit = function(amount, tollPlaza, description = 'Toll payment', paymentId = null) {
  if (this.balance < amount) {
    throw new Error('Insufficient balance');
  }
  
  this.balance -= amount;
  return this.addTransaction('debit', amount, description, tollPlaza, paymentId);
};

// Instance method to block/unblock tag
tagSchema.methods.updateBlockStatus = function(isBlocked, reason = null, blockedBy = null) {
  this.security.isBlocked = isBlocked;
  this.security.blockReason = isBlocked ? reason : null;
  this.security.blockedAt = isBlocked ? new Date() : null;
  this.security.blockedBy = isBlocked ? blockedBy : null;
  this.status = isBlocked ? 'blocked' : 'active';
  
  return this.save();
};

// Static method to get tags by user
tagSchema.statics.getTagsByUser = function(userId) {
  return this.find({ userId })
    .populate('vehicleId', 'registrationNumber vehicleType model')
    .populate('personalDetailsId', 'fullName phoneNumber')
    .populate('paymentId', 'amount paymentStatus')
    .sort({ createdAt: -1 });
};

// Static method to get tag with full details
tagSchema.statics.getTagWithDetails = function(tagId) {
  return this.findOne({ tagId })
    .populate('userId', 'name email mobile')
    .populate('vehicleId')
    .populate('personalDetailsId')
};

// Static method to get usage statistics
tagSchema.statics.getUserStatistics = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalTags: { $sum: 1 },
        activeTags: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        totalBalance: { $sum: '$balance' },
        totalRecharges: { $sum: '$statistics.totalRecharges' },
        totalTrips: { $sum: '$statistics.totalTrips' },
        totalSpent: { $sum: '$statistics.totalTollAmount' }
      }
    }
  ]);
};

// Pre-save middleware to ensure tagId is unique and formatted correctly
tagSchema.pre('save', async function(next) {
  if (this.isNew && !this.tagId) {
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      const randomNum = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
      const newTagId = 'FT' + randomNum;
      
      const existing = await this.constructor.findOne({ tagId: newTagId });
      if (!existing) {
        this.tagId = newTagId;
        isUnique = true;
      }
      attempts++;
    }
    
    if (!isUnique) {
      return next(new Error('Unable to generate unique FastTag ID'));
    }
  }
  next();
});

// Pre-save middleware to update balance after transaction
tagSchema.pre('save', function(next) {
  if (this.transactionHistory && this.transactionHistory.length > 0) {
    const lastTransaction = this.transactionHistory[this.transactionHistory.length - 1];
    if (lastTransaction && lastTransaction.balanceAfter !== undefined) {
      lastTransaction.balanceAfter = this.balance;
    }
  }
  next();
});

module.exports = mongoose.model('FastTag', tagSchema);