// const asyncHandler = require('express-async-handler');
// const FastTag = require('../models/tagModel');
// const Vehicle = require('../models/vehicleModel');
// const UserDetails = require('../models/personaldetailsModel');
// const Payment = require('../models/paymentlogModel');
// const User = require('../models/userModel');

// // @desc    Create new FastTag after successful payment
// // @route   POST /api/tags
// // @access  Private
// const createTag = asyncHandler(async (req, res) => {
//   const { 
//     vehicleId, 
//     personalDetailsId, 
//     paymentId, 
//     initialBalance = 0,
//     metadata 
//   } = req.body;

//   // Verify all required documents exist
//   const vehicle = await Vehicle.findById(vehicleId);
//   if (!vehicle) {
//     res.status(404);
//     throw new Error('Vehicle not found');
//   }

//   const personalDetails = await UserDetails.findById(personalDetailsId);
//   if (!personalDetails) {
//     res.status(404);
//     throw new Error('Personal details not found');
//   }

  
// // Verify payment is successful and for new FastTag
//   if (payment.paymentStatus !== 'success' || payment.paymentFlag !== 0) {
//     res.status(400);
//     throw new Error('Invalid payment record for FastTag creation');
//   }

//   // Check if FastTag already exists for this vehicle
//   const existingTag = await FastTag.findOne({ vehicleId });
//   if (existingTag) {
//     res.status(400);
//     throw new Error('FastTag already exists for this vehicle');
//   }

//   // Create new FastTag
//   const tag = await FastTag.create({
//     userId: req.user.id,
//     vehicleId,
//     personalDetailsId,
//     balance: initialBalance,
//     vehicleInfo: {
//       registrationNumber: vehicle.registrationNumber,
//       vehicleType: vehicle.vehicleType,
//       model: vehicle.model,
//       chassisNumber: vehicle.chassisNumber,
//       engineNumber: vehicle.engineNumber
//     },
//     personalInfo: {
//       fullName: personalDetails.fullName,
//       phoneNumber: req.user.mobile,
//       email: req.user.email,
//       panNumber: personalDetails.panNumber,
//       aadharNumber: personalDetails.aadharNumber
//     },
//     metadata: {
//       ...metadata,
//       source: 'web'
//     }
//   });

//   // Add initial transaction if balance > 0
//   if (initialBalance > 0) {
//     await tag.addTransaction('recharge', initialBalance, 'Initial balance', null, paymentId);
//   }

//   // Populate the response
//   const populatedTag = await FastTag.findById(tag._id)
//     .populate('vehicleId', 'registrationNumber vehicleType model')
//     .populate('personalDetailsId', 'fullName panNumber')

//   res.status(201).json({
//     success: true,
//     message: 'FastTag created successfully',
//     data: populatedTag
//   });
// });

// // @desc    Get all tags for a user
// // @route   GET /api/tags
// // @access  Private
// const getUserTags = asyncHandler(async (req, res) => {
//   const tags = await FastTag.getTagsByUser(req.user.id);

//   res.status(200).json({
//     success: true,
//     count: tags.length,
//     data: tags
//   });
// });

// // @desc    Get single tag by ID
// // @route   GET /api/tags/:tagId
// // @access  Private
// const getTagById = asyncHandler(async (req, res) => {
//   const tag = await FastTag.getTagWithDetails(req.params.tagId);

//   if (!tag) {
//     res.status(404);
//     throw new Error('FastTag not found');
//   }

//   // Check if user owns this tag
//   if (tag.userId.toString() !== req.user.id) {
//     res.status(403);
//     throw new Error('Not authorized to access this FastTag');
//   }

//   res.status(200).json({
//     success: true,
//     data: tag
//   });
// });

// // @desc    Get tag by vehicle registration number
// // @route   GET /api/tags/vehicle/:regNumber
// // @access  Private
// const getTagByVehicle = asyncHandler(async (req, res) => {
//   const regNumber = req.params.regNumber.toUpperCase();
  
//   const tag = await FastTag.findOne({ 
//     'vehicleInfo.registrationNumber': regNumber,
//     userId: req.user.id 
//   })
//   .populate('vehicleId', 'registrationNumber vehicleType model')
//   .populate('personalDetailsId', 'fullName panNumber')
//   .populate('paymentId', 'amount paymentStatus');

//   if (!tag) {
//     res.status(404);
//     throw new Error('FastTag not found for this vehicle');
//   }

//   res.status(200).json({
//     success: true,
//     data: tag
//   });
// });

// // @desc    Recharge FastTag balance
// // @route   POST /api/tags/:tagId/recharge
// // @access  Private
// const rechargeTag = asyncHandler(async (req, res) => {
//   const { amount, paymentId, description = 'Balance recharge' } = req.body;

//   if (!amount || amount <= 0) {
//     res.status(400);
//     throw new Error('Invalid recharge amount');
//   }

//   const tag = await FastTag.findOne({ 
//     tagId: req.params.tagId,
//     userId: req.user.id 
//   });

//   if (!tag) {
//     res.status(404);
//     throw new Error('FastTag not found');
//   }

//   if (tag.status !== 'active') {
//     res.status(400);
//     throw new Error('Cannot recharge inactive FastTag');
//   }

//   // Verify payment if paymentId is provided
//   if (paymentId) {
//     const payment = await Payment.findById(paymentId);
//     if (!payment || payment.paymentStatus !== 'success' || payment.paymentFlag !== 1) {
//       res.status(400);
//       throw new Error('Invalid payment record for recharge');
//     }
//   }

//   // Perform recharge
//   await tag.recharge(amount, description, paymentId);

//   res.status(200).json({
//     success: true,
//     message: 'FastTag recharged successfully',
//     data: {
//       tagId: tag.tagId,
//       previousBalance: tag.balance - amount,
//       rechargeAmount: amount,
//       newBalance: tag.balance
//     }
//   });
// });

// // @desc    Get tag transaction history
// // @route   GET /api/tags/:tagId/transactions
// // @access  Private
// const getTagTransactions = asyncHandler(async (req, res) => {
//   const { page = 1, limit = 20, type, startDate, endDate } = req.query;

//   const tag = await FastTag.findOne({ 
//     tagId: req.params.tagId,
//     userId: req.user.id 
//   });

//   if (!tag) {
//     res.status(404);
//     throw new Error('FastTag not found');
//   }

//   let transactions = tag.transactionHistory;

//   // Filter by type if specified
//   if (type) {
//     transactions = transactions.filter(txn => txn.type === type);
//   }

//   // Filter by date range if specified
//   if (startDate || endDate) {
//     transactions = transactions.filter(txn => {
//       const txnDate = new Date(txn.transactionDate);
//       const start = startDate ? new Date(startDate) : new Date('1900-01-01');
//       const end = endDate ? new Date(endDate) : new Date();
//       return txnDate >= start && txnDate <= end;
//     });
//   }

//   // Sort by date (newest first)
//   transactions.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));

//   // Pagination
//   const startIndex = (page - 1) * limit;
//   const endIndex = page * limit;
//   const paginatedTransactions = transactions.slice(startIndex, endIndex);

//   res.status(200).json({
//     success: true,
//     data: paginatedTransactions,
//     pagination: {
//       current: parseInt(page),
//       total: Math.ceil(transactions.length / limit),
//       count: paginatedTransactions.length,
//       totalRecords: transactions.length
//     }
//   });
// });

// // @desc    Block/Unblock FastTag
// // @route   PUT /api/tags/:tagId/block
// // @access  Private
// const toggleTagBlockStatus = asyncHandler(async (req, res) => {
//   const { isBlocked, reason } = req.body;

//   const tag = await FastTag.findOne({ 
//     tagId: req.params.tagId,
//     userId: req.user.id 
//   });

//   if (!tag) {
//     res.status(404);
//     throw new Error('FastTag not found');
//   }

//   await tag.updateBlockStatus(isBlocked, reason, req.user.id);

//   res.status(200).json({
//     success: true,
//     message: `FastTag ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
//     data: {
//       tagId: tag.tagId,
//       status: tag.status,
//       isBlocked: tag.security.isBlocked,
//       blockReason: tag.security.blockReason
//     }
//   });
// });

// // @desc    Get user statistics
// // @route   GET /api/tags/stats
// // @access  Private
// const getUserTagStats = asyncHandler(async (req, res) => {
//   const stats = await FastTag.getUserStatistics(req.user.id);

//   res.status(200).json({
//     success: true,
//     data: stats[0] || {
//       totalTags: 0,
//       activeTags: 0,
//       totalBalance: 0,
//       totalRecharges: 0,
//       totalTrips: 0,
//       totalSpent: 0
//     }
//   });
// });

// // @desc    Delete FastTag (admin only or expired tags)
// // @route   DELETE /api/tags/:tagId
// // @access  Private
// const deleteTag = asyncHandler(async (req, res) => {
//   const tag = await FastTag.findOne({ 
//     tagId: req.params.tagId,
//     userId: req.user.id 
//   });

//   if (!tag) {
//     res.status(404);
//     throw new Error('FastTag not found');
//   }

//   // Only allow deletion if tag is inactive or expired
//   if (tag.status === 'active' && new Date() < tag.expiryDate) {
//     res.status(400);
//     throw new Error('Cannot delete active FastTag. Please deactivate first.');
//   }

//   await FastTag.findByIdAndDelete(tag._id);

//   res.status(200).json({
//     success: true,
//     message: 'FastTag deleted successfully'
//   });
// });

// // @desc    Create FastTag from successful payment (called after payment success)
// // @route   POST /api/tags/create-from-payment
// // @access  Private
// const createTagFromPayment = asyncHandler(async (req, res) => {
//   const { paymentId, vehicleId, personalDetailsId, initialBalance, metadata } = req.body;

//   console.log('createTagFromPayment - Request body:', req.body);
//   console.log('createTagFromPayment - User ID:', req.user.id);

//   // If paymentId is provided, fetch payment details
//   let payment = null;
//   let vehicleData = null;
//   let personalData = null;

//   if (paymentId) {
//     payment = await Payment.findById(paymentId)
//       .populate('vehicleId')
//       .populate('personalDetailsId');

//     if (!payment) {
//       res.status(404);
//       throw new Error('Payment not found');
//     }

//     if (payment.userId.toString() !== req.user.id) {
//       res.status(403);
//       throw new Error('Not authorized');
//     }

//     if (payment.paymentStatus !== 'success' && payment.paymentStatus !== 'initiated') {
//       res.status(400);
//       throw new Error('Payment not successful');
//     }

//     // Check if tag already exists for this payment
//     const existingTag = await FastTag.findOne({ 'metadata.paymentId': paymentId });
//     if (existingTag) {
//       console.log('FastTag already exists:', existingTag.tagId);
//       return res.status(200).json({
//         success: true,
//         message: 'FastTag already exists',
//         data: existingTag
//       });
//     }

//     vehicleData = payment.vehicleId;
//     personalData = payment.personalDetailsId;
//   } else {
//     // Use direct IDs if paymentId not provided
//     vehicleData = await Vehicle.findById(vehicleId);
//     personalData = await UserDetails.findById(personalDetailsId);

//     if (!vehicleData || !personalData) {
//       res.status(404);
//       throw new Error('Vehicle or personal details not found');
//     }

//     // Check if tag already exists for this vehicle
//     const existingTag = await FastTag.findOne({ vehicleId });
//     if (existingTag) {
//       return res.status(200).json({
//         success: true,
//         message: 'FastTag already exists',
//         data: existingTag
//       });
//     }
//   }

//   // Create FastTag
//   const tagBalance = initialBalance || (payment ? Math.max(0, payment.amount - 100) : 0);

//   console.log('Creating FastTag with balance:', tagBalance);

//   const tag = await FastTag.create({
//     userId: req.user.id,
//     vehicleId: vehicleData._id,
//     personalDetailsId: personalData._id,
//     balance: tagBalance,
//     vehicleInfo: {
//       registrationNumber: vehicleData.registrationNumber,
//       vehicleType: vehicleData.vehicleType,
//       model: vehicleData.model,
//       chassisNumber: vehicleData.chassisNumber,
//       engineNumber: vehicleData.engineNumber
//     },
//     personalInfo: {
//       fullName: personalData.fullName,
//       phoneNumber: req.user.mobile || '0000000000',
//       email: req.user.email,
//       panNumber: personalData.panNumber,
//       aadharNumber: personalData.aadharNumber
//     },
//     metadata: {
//       ...metadata,
//       paymentId: paymentId || null,
//       source: metadata?.source || 'web'
//     }
//   });

//   console.log('FastTag created:', tag.tagId);

//   // Add initial balance transaction
//   if (tagBalance > 0) {
//     await tag.addTransaction(
//       'recharge',
//       tagBalance,
//       'Initial balance from FastTag purchase',
//       null,
//       paymentId
//     );
//   }

//   // Populate response
//   const populatedTag = await FastTag.findById(tag._id)
//     .populate('vehicleId', 'registrationNumber vehicleType model')
//     .populate('personalDetailsId', 'fullName panNumber');

//   res.status(201).json({
//     success: true,
//     message: 'FastTag created successfully',
//     data: populatedTag
//   });
// });

// module.exports = {
//   createTag,
//   getUserTags,
//   getTagById,
//   getTagByVehicle,
//   rechargeTag,
//   getTagTransactions,
//   toggleTagBlockStatus,
//   getUserTagStats,
//   deleteTag,
//   createTagFromPayment
// };
const asyncHandler = require('express-async-handler');
const FastTag = require('../models/tagModel');
const Vehicle = require('../models/vehicleModel');
const UserDetails = require('../models/personaldetailsModel');
const Payment = require('../models/paymentlogModel');
const User = require('../models/userModel');

// @desc    Create new FastTag after successful payment
// @route   POST /api/tags
// @access  Private
const createTag = asyncHandler(async (req, res) => {
  const { 
    vehicleId, 
    personalDetailsId, 
    paymentId, 
    initialBalance = 0,
    metadata 
  } = req.body;

  // Verify all required documents exist
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }

  const personalDetails = await UserDetails.findById(personalDetailsId);
  if (!personalDetails) {
    res.status(404);
    throw new Error('Personal details not found');
  }

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  // Verify payment is successful and for new FastTag
  if (payment.paymentStatus !== 'success' || payment.paymentFlag !== 0) {
    res.status(400);
    throw new Error('Invalid payment record for FastTag creation');
  }

  // Check if FastTag already exists for this vehicle
  const existingTag = await FastTag.findOne({ vehicleId });
  if (existingTag) {
    res.status(400);
    throw new Error('FastTag already exists for this vehicle');
  }

  // Create new FastTag
  const tag = await FastTag.create({
    userId: req.user.id,
    vehicleId,
    personalDetailsId,
    balance: initialBalance,
    vehicleInfo: {
      registrationNumber: vehicle.registrationNumber,
      vehicleType: vehicle.vehicleType,
      model: vehicle.model,
      chassisNumber: vehicle.chassisNumber,
      engineNumber: vehicle.engineNumber
    },
    personalInfo: {
      fullName: personalDetails.fullName,
      phoneNumber: req.user.mobile,
      email: req.user.email,
      panNumber: personalDetails.panNumber,
      aadharNumber: personalDetails.aadharNumber
    },
    metadata: {
      ...metadata,
      source: 'web'
    }
  });

  // Add initial transaction if balance > 0
  if (initialBalance > 0) {
    await tag.addTransaction('recharge', initialBalance, 'Initial balance', null, paymentId);
  }

  // Populate the response
  const populatedTag = await FastTag.findById(tag._id)
    .populate('vehicleId', 'registrationNumber vehicleType model')
    .populate('personalDetailsId', 'fullName panNumber');

  res.status(201).json({
    success: true,
    message: 'FastTag created successfully',
    data: populatedTag
  });
});

// @desc    Get all tags for a user
// @route   GET /api/tags
// @access  Private
const getUserTags = asyncHandler(async (req, res) => {
  console.log('getUserTags - User ID:', req.user.id);

  // Direct mongoose query instead of static method
  const tags = await FastTag.find({ userId: req.user.id })
    .populate('vehicleId', 'registrationNumber vehicleType model chassisNumber engineNumber')
    .populate('personalDetailsId', 'fullName panNumber aadharNumber')
    .sort({ createdAt: -1 })
    .lean();

  console.log('getUserTags - Found tags:', tags.length);
  
  // Debug: Check if tags exist at all
  if (tags.length === 0) {
    const totalTags = await FastTag.countDocuments({});
    const userIdStr = req.user.id.toString();
    console.log('Total tags in DB:', totalTags);
    console.log('User ID being searched:', userIdStr);
    
    // Check for userId field mismatch
    const sampleTag = await FastTag.findOne({}).lean();
    if (sampleTag) {
      console.log('Sample tag userId field:', sampleTag.userId);
      console.log('Sample tag userId type:', typeof sampleTag.userId);
    }
  }

  res.status(200).json({
    success: true,
    count: tags.length,
    data: tags
  });
});

// @desc    Get single tag by ID
// @route   GET /api/tags/:tagId
// @access  Private
const getTagById = asyncHandler(async (req, res) => {
  const tag = await FastTag.findOne({ tagId: req.params.tagId })
    .populate('vehicleId', 'registrationNumber vehicleType model')
    .populate('personalDetailsId', 'fullName panNumber')
    .lean();

  if (!tag) {
    res.status(404);
    throw new Error('FastTag not found');
  }

  // Check if user owns this tag
  if (tag.userId.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to access this FastTag');
  }

  res.status(200).json({
    success: true,
    data: tag
  });
});

// @desc    Get tag by vehicle registration number
// @route   GET /api/tags/vehicle/:regNumber
// @access  Private
const getTagByVehicle = asyncHandler(async (req, res) => {
  const regNumber = req.params.regNumber.toUpperCase();
  
  const tag = await FastTag.findOne({ 
    'vehicleInfo.registrationNumber': regNumber,
    userId: req.user.id 
  })
  .populate('vehicleId', 'registrationNumber vehicleType model')
  .populate('personalDetailsId', 'fullName panNumber')
  .lean();

  if (!tag) {
    res.status(404);
    throw new Error('FastTag not found for this vehicle');
  }

  res.status(200).json({
    success: true,
    data: tag
  });
});

// @desc    Recharge FastTag balance
// @route   POST /api/tags/:tagId/recharge
// @access  Private
const rechargeTag = asyncHandler(async (req, res) => {
  const { amount, paymentId, description = 'Balance recharge' } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Invalid recharge amount');
  }

  const tag = await FastTag.findOne({ 
    tagId: req.params.tagId,
    userId: req.user.id 
  });

  if (!tag) {
    res.status(404);
    throw new Error('FastTag not found');
  }

  if (tag.status !== 'active') {
    res.status(400);
    throw new Error('Cannot recharge inactive FastTag');
  }

  // Verify payment if paymentId is provided
  if (paymentId) {
    const payment = await Payment.findById(paymentId);
    if (!payment || payment.paymentStatus !== 'success' || payment.paymentFlag !== 1) {
      res.status(400);
      throw new Error('Invalid payment record for recharge');
    }
  }

  const previousBalance = tag.balance;

  // Perform recharge
  await tag.recharge(amount, description, paymentId);

  console.log('Recharge successful - Previous:', previousBalance, 'New:', tag.balance);

  res.status(200).json({
    success: true,
    message: 'FastTag recharged successfully',
    data: {
      tagId: tag.tagId,
      previousBalance: previousBalance,
      rechargeAmount: amount,
      newBalance: tag.balance
    }
  });
});

// @desc    Get tag transaction history
// @route   GET /api/tags/:tagId/transactions
// @access  Private
const getTagTransactions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type, startDate, endDate } = req.query;

  const tag = await FastTag.findOne({ 
    tagId: req.params.tagId,
    userId: req.user.id 
  });

  if (!tag) {
    res.status(404);
    throw new Error('FastTag not found');
  }

  let transactions = tag.transactionHistory || [];

  // Filter by type if specified
  if (type) {
    transactions = transactions.filter(txn => txn.type === type);
  }

  // Filter by date range if specified
  if (startDate || endDate) {
    transactions = transactions.filter(txn => {
      const txnDate = new Date(txn.transactionDate);
      const start = startDate ? new Date(startDate) : new Date('1900-01-01');
      const end = endDate ? new Date(endDate) : new Date();
      return txnDate >= start && txnDate <= end;
    });
  }

  // Sort by date (newest first)
  transactions.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  console.log('getTagTransactions - Returning', paginatedTransactions.length, 'transactions');

  res.status(200).json({
    success: true,
    data: paginatedTransactions,
    pagination: {
      current: parseInt(page),
      total: Math.ceil(transactions.length / limit),
      count: paginatedTransactions.length,
      totalRecords: transactions.length
    }
  });
});

// @desc    Block/Unblock FastTag
// @route   PUT /api/tags/:tagId/block
// @access  Private
const toggleTagBlockStatus = asyncHandler(async (req, res) => {
  const { isBlocked, reason } = req.body;

  const tag = await FastTag.findOne({ 
    tagId: req.params.tagId,
    userId: req.user.id 
  });

  if (!tag) {
    res.status(404);
    throw new Error('FastTag not found');
  }

  await tag.updateBlockStatus(isBlocked, reason, req.user.id);

  console.log('Tag block status updated:', tag.tagId, 'Blocked:', isBlocked);

  res.status(200).json({
    success: true,
    message: `FastTag ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
    data: {
      tagId: tag.tagId,
      status: tag.status,
      isBlocked: tag.security.isBlocked,
      blockReason: tag.security.blockReason
    }
  });
});

// @desc    Get user statistics
// @route   GET /api/tags/stats
// @access  Private
const getUserTagStats = asyncHandler(async (req, res) => {
  console.log('getUserTagStats - User ID:', req.user.id);

  // Use direct aggregation instead of static method
  const stats = await FastTag.aggregate([
    {
      $match: { 
        userId: req.user.id 
      }
    },
    {
      $group: {
        _id: null,
        totalTags: { $sum: 1 },
        activeTags: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        totalBalance: { $sum: '$balance' },
        totalTrips: { $sum: { $ifNull: ['$statistics.totalTrips', 0] } },
        totalRecharges: { $sum: { $ifNull: ['$statistics.totalRecharges', 0] } },
        totalSpent: { $sum: { $ifNull: ['$statistics.totalSpent', 0] } }
      }
    }
  ]);

  console.log('getUserTagStats - Aggregation result:', stats);

  const result = stats[0] || {
    totalTags: 0,
    activeTags: 0,
    totalBalance: 0,
    totalRecharges: 0,
    totalTrips: 0,
    totalSpent: 0
  };

  console.log('getUserTagStats - Returning:', result);

  res.status(200).json({
    success: true,
    data: result
  });
});

// @desc    Delete FastTag (admin only or expired tags)
// @route   DELETE /api/tags/:tagId
// @access  Private
const deleteTag = asyncHandler(async (req, res) => {
  const tag = await FastTag.findOne({ 
    tagId: req.params.tagId,
    userId: req.user.id 
  });

  if (!tag) {
    res.status(404);
    throw new Error('FastTag not found');
  }

  // Only allow deletion if tag is inactive or expired
  if (tag.status === 'active' && new Date() < tag.expiryDate) {
    res.status(400);
    throw new Error('Cannot delete active FastTag. Please deactivate first.');
  }

  await FastTag.findByIdAndDelete(tag._id);

  console.log('FastTag deleted:', tag.tagId);

  res.status(200).json({
    success: true,
    message: 'FastTag deleted successfully'
  });
});

// @desc    Create FastTag from successful payment (called after payment success)
// @route   POST /api/tags/create-from-payment
// @access  Private
const createTagFromPayment = asyncHandler(async (req, res) => {
  const { paymentId, vehicleId, personalDetailsId, initialBalance, metadata } = req.body;

  console.log('createTagFromPayment - Request body:', req.body);
  console.log('createTagFromPayment - User ID:', req.user.id);

  // If paymentId is provided, fetch payment details
  let payment = null;
  let vehicleData = null;
  let personalData = null;

  if (paymentId) {
    payment = await Payment.findById(paymentId)
      .populate('vehicleId')
      .populate('personalDetailsId');

    if (!payment) {
      res.status(404);
      throw new Error('Payment not found');
    }

    if (payment.userId.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized');
    }

    if (payment.paymentStatus !== 'success' && payment.paymentStatus !== 'initiated') {
      res.status(400);
      throw new Error('Payment not successful');
    }

    // Check if tag already exists for this payment
    const existingTag = await FastTag.findOne({ 'metadata.paymentId': paymentId });
    if (existingTag) {
      console.log('FastTag already exists:', existingTag.tagId);
      return res.status(200).json({
        success: true,
        message: 'FastTag already exists',
        data: existingTag
      });
    }

    vehicleData = payment.vehicleId;
    personalData = payment.personalDetailsId;
  } else {
    // Use direct IDs if paymentId not provided
    vehicleData = await Vehicle.findById(vehicleId);
    personalData = await UserDetails.findById(personalDetailsId);

    if (!vehicleData || !personalData) {
      res.status(404);
      throw new Error('Vehicle or personal details not found');
    }

    // Check if tag already exists for this vehicle
    const existingTag = await FastTag.findOne({ vehicleId });
    if (existingTag) {
      console.log('FastTag already exists for vehicle:', existingTag.tagId);
      return res.status(200).json({
        success: true,
        message: 'FastTag already exists',
        data: existingTag
      });
    }
  }

  // Create FastTag
  const tagBalance = initialBalance || (payment ? Math.max(0, payment.amount - 100) : 0);

  console.log('Creating FastTag with balance:', tagBalance);

  const tag = await FastTag.create({
    userId: req.user.id,
    vehicleId: vehicleData._id,
    personalDetailsId: personalData._id,
    balance: tagBalance,
    vehicleInfo: {
      registrationNumber: vehicleData.registrationNumber,
      vehicleType: vehicleData.vehicleType,
      model: vehicleData.model,
      chassisNumber: vehicleData.chassisNumber,
      engineNumber: vehicleData.engineNumber
    },
    personalInfo: {
      fullName: personalData.fullName,
      phoneNumber: req.user.mobile || '0000000000',
      email: req.user.email,
      panNumber: personalData.panNumber,
      aadharNumber: personalData.aadharNumber
    },
    metadata: {
      ...metadata,
      paymentId: paymentId || null,
      source: metadata?.source || 'web'
    }
  });

  console.log('FastTag created successfully:', tag.tagId);

  // Add initial balance transaction
  if (tagBalance > 0) {
    await tag.addTransaction(
      'recharge',
      tagBalance,
      'Initial balance from FastTag purchase',
      null,
      paymentId
    );
    console.log('Initial transaction added');
  }

  // Populate response
  const populatedTag = await FastTag.findById(tag._id)
    .populate('vehicleId', 'registrationNumber vehicleType model')
    .populate('personalDetailsId', 'fullName panNumber')
    .lean();

  console.log('Returning populated tag');

  res.status(201).json({
    success: true,
    message: 'FastTag created successfully',
    data: populatedTag
  });
});

module.exports = {
  createTag,
  getUserTags,
  getTagById,
  getTagByVehicle,
  rechargeTag,
  getTagTransactions,
  toggleTagBlockStatus,
  getUserTagStats,
  deleteTag,
  createTagFromPayment
};