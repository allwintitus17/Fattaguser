// controllers/paymentController.js
const asyncHandler = require('express-async-handler');
const Payment = require('../models/paymentlogModel');
const User = require('../models/userModel');
const Vehicle = require('../models/vehicleModel');
const UserDetails = require('../models/personaldetailsModel');
const crypto = require('crypto');
const QRCode = require('qrcode');

// Your UPI ID configuration
const UPI_CONFIG = {
  payeeVPA: 'fasttag@paytm', // Replace with your actual UPI ID
  merchantName: 'FastTag Services',
  merchantCode: '0000'
};

// @desc    Create new payment
// @route   POST /api/payments/create
// @access  Private
const createPayment = asyncHandler(async (req, res) => {
  const {
    paymentFlag,
    amount,
    vehicleId,
    personalDetailsId,
    tripDetails,
    rechargeDetails,
    metadata
  } = req.body;

  const userId = req.user.id;

  // Validate payment flag
  if (![0, 1, 2].includes(paymentFlag)) {
    res.status(400);
    throw new Error('Invalid payment flag. Must be 0 (New Tag), 1 (Recharge), or 2 (Trips)');
  }

  // Validate required fields based on payment flag
  if (paymentFlag === 0 && (!vehicleId || !personalDetailsId)) {
    res.status(400);
    throw new Error('Vehicle ID and Personal Details ID are required for new tag payment');
  }

  if (paymentFlag === 2 && !vehicleId) {
    res.status(400);
    throw new Error('Vehicle ID is required for trip payment');
  }

  // Get user details
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  let vehicleInfo = {};
  let personalInfo = {
    fullName: user.name,
    phoneNumber: user.mobile,
    email: user.email
  };

  // Get vehicle information if needed
  if (vehicleId) {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      res.status(404);
      throw new Error('Vehicle not found');
    }

    if (vehicle.ownerId.toString() !== userId) {
      res.status(403);
      throw new Error('Access denied to this vehicle');
    }

    vehicleInfo = {
      registrationNumber: vehicle.registrationNumber,
      vehicleType: vehicle.vehicleType,
      model: vehicle.model,
      chassisNumber: vehicle.chassisNumber,
      engineNumber: vehicle.engineNumber
    };
  }

  // Get personal details if needed
  if (personalDetailsId) {
    const personalDetails = await UserDetails.findById(personalDetailsId);
    if (!personalDetails) {
      res.status(404);
      throw new Error('Personal details not found');
    }

    if (personalDetails.authUserId.toString() !== userId) {
      res.status(403);
      throw new Error('Access denied to these personal details');
    }

    personalInfo = {
      ...personalInfo,
      fullName: personalDetails.fullName,
      panNumber: personalDetails.panNumber,
      aadharNumber: personalDetails.aadharNumber
    };
  }

  // Generate payment ID and UPI details
  const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const merchantTransactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

  // Create UPI payment string
  const upiPaymentString = `upi://pay?pa=${UPI_CONFIG.payeeVPA}&pn=${UPI_CONFIG.merchantName}&mc=${UPI_CONFIG.merchantCode}&tid=${merchantTransactionId}&tr=${paymentId}&tn=FastTag Payment&am=${amount}&cu=INR`;

  // Generate QR code
  let qrCodeDataUrl;
  try {
    qrCodeDataUrl = await QRCode.toDataURL(upiPaymentString);
  } catch (error) {
    console.error('QR Code generation error:', error);
    qrCodeDataUrl = null;
  }

  // Create payment record
  const payment = await Payment.create({
    userId,
    vehicleId: vehicleId || null,
    personalDetailsId: personalDetailsId || null,
    paymentId,
    paymentFlag,
    amount,
    vehicleInfo,
    personalInfo,
    upiDetails: {
      payeeVPA: UPI_CONFIG.payeeVPA,
      merchantTransactionId,
      qrCode: qrCodeDataUrl,
      deepLink: upiPaymentString
    },
    tripDetails: tripDetails || {},
    rechargeDetails: rechargeDetails || {},
    metadata: {
      ...metadata,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      source: 'web'
    },
    paymentStatus: 'initiated'
  });

  res.status(201).json({
    success: true,
    message: 'Payment created successfully',
    payment: {
      _id: payment._id,
      paymentId: payment.paymentId,
      amount: payment.amount,
      paymentFlag: payment.paymentFlag,
      paymentTypeDescription: payment.paymentTypeDescription,
      upiDetails: payment.upiDetails,
      paymentStatus: payment.paymentStatus,
      expiresAt: payment.expiresAt
    }
  });
});

// @desc    Verify UPI payment
// @route   POST /api/payments/verify-upi
// @access  Private
const verifyUpiPayment = asyncHandler(async (req, res) => {
  const {
    paymentId,
    transactionId,
    upiTransactionId,
    status,
    signature
  } = req.body;

  const userId = req.user.id;

  // Find payment record
  const payment = await Payment.findOne({
    paymentId,
    userId
  });

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  // Check if payment is already processed
  if (payment.paymentStatus === 'success') {
    res.status(400);
    throw new Error('Payment already verified');
  }

  // Check if payment has expired
  if (new Date() > payment.expiresAt) {
    payment.paymentStatus = 'failed';
    payment.gatewayResponse = {
      responseCode: 'EXPIRED',
      responseMessage: 'Payment session expired'
    };
    await payment.save();

    res.status(400);
    throw new Error('Payment session expired');
  }

  // Update payment with verification details
  payment.transactionId = transactionId;
  payment.paymentStatus = status === 'SUCCESS' ? 'success' : 'failed';
  payment.gatewayResponse = {
    responseCode: status,
    responseMessage: status === 'SUCCESS' ? 'Payment successful' : 'Payment failed',
    gatewayTransactionId: upiTransactionId,
    signature
  };

  if (status === 'SUCCESS') {
    payment.completedAt = new Date();
  }

  await payment.save();

  // Populate related data for response
  await payment.populate([
    { path: 'userId', select: 'name email mobile' },
    { path: 'vehicleId', select: 'registrationNumber vehicleType model' },
    { path: 'personalDetailsId', select: 'fullName panNumber' }
  ]);

  res.json({
    success: true,
    message: status === 'SUCCESS' ? 'Payment verified successfully' : 'Payment verification failed',
    payment
  });
});

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('userId', 'name email mobile')
    .populate('vehicleId', 'registrationNumber vehicleType model')
    .populate('personalDetailsId', 'fullName panNumber');

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  // Check if user owns this payment
  if (payment.userId._id.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Access denied');
  }

  res.json({
    success: true,
    payment
  });
});

// @desc    Get user payments
// @route   GET /api/payments/user
// @access  Private
const getUserPayments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, paymentFlag, status } = req.query;
  const userId = req.user.id;

  // Build query
  let query = { userId };
  
  if (paymentFlag !== undefined) {
    query.paymentFlag = parseInt(paymentFlag);
  }
  
  if (status) {
    query.paymentStatus = status;
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get payments with pagination
  const payments = await Payment.find(query)
    .populate('userId', 'name email mobile')
    .populate('vehicleId', 'registrationNumber vehicleType model')
    .populate('personalDetailsId', 'fullName panNumber')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(skip);

  // Get total count
  const totalPayments = await Payment.countDocuments(query);

  res.json({
    success: true,
    payments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: totalPayments,
      pages: Math.ceil(totalPayments / parseInt(limit))
    }
  });
});

// @desc    Update payment status
// @route   PATCH /api/payments/:id/status
// @access  Private
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { status, reason, additionalInfo } = req.body;
  
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  // Check if user owns this payment
  if (payment.userId.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Access denied');
  }

  const oldStatus = payment.paymentStatus;
  payment.paymentStatus = status;

  if (status === 'success' && !payment.completedAt) {
    payment.completedAt = new Date();
  }

  // Update gateway response
  payment.gatewayResponse = {
    ...payment.gatewayResponse,
    responseCode: status.toUpperCase(),
    responseMessage: reason || `Payment ${status}`,
    additionalInfo
  };

  await payment.save();

  res.json({
    success: true,
    message: `Payment status updated from ${oldStatus} to ${status}`,
    payment
  });
});

// @desc    Get payment statistics
// @route   GET /api/payments/stats
// @access  Private
const getPaymentStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const stats = await Payment.getPaymentStats(userId);

  // Get recent payments
  const recentPayments = await Payment.find({ userId })
    .populate('vehicleId', 'registrationNumber vehicleType')
    .sort({ createdAt: -1 })
    .limit(5)
    .select('paymentId amount paymentFlag paymentStatus createdAt vehicleInfo.registrationNumber');

  res.json({
    success: true,
    stats,
    recentPayments
  });
});

// @desc    Cancel payment
// @route   PATCH /api/payments/:id/cancel
// @access  Private
const cancelPayment = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  // Check if user owns this payment
  if (payment.userId.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Access denied');
  }

  // Check if payment can be cancelled
  if (['success', 'cancelled', 'refunded'].includes(payment.paymentStatus)) {
    res.status(400);
    throw new Error(`Cannot cancel payment with status: ${payment.paymentStatus}`);
  }

  payment.paymentStatus = 'cancelled';
  payment.gatewayResponse = {
    ...payment.gatewayResponse,
    responseCode: 'CANCELLED',
    responseMessage: reason || 'Payment cancelled by user'
  };

  await payment.save();

  res.json({
    success: true,
    message: 'Payment cancelled successfully',
    payment
  });
});

// @desc    Process refund
// @route   POST /api/payments/:id/refund
// @access  Private (Admin or user)
const processRefund = asyncHandler(async (req, res) => {
  const { refundAmount, refundReason } = req.body;
  
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  // Check if user owns this payment
  if (payment.userId.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Access denied');
  }

  // Check if payment is eligible for refund
  if (payment.paymentStatus !== 'success') {
    res.status(400);
    throw new Error('Only successful payments can be refunded');
  }

  if (payment.refundInfo && payment.refundInfo.refundStatus === 'success') {
    res.status(400);
    throw new Error('Payment already refunded');
  }

  // Validate refund amount
  const maxRefundAmount = payment.amount - (payment.refundInfo?.refundAmount || 0);
  if (refundAmount > maxRefundAmount) {
    res.status(400);
    throw new Error(`Refund amount cannot exceed ${maxRefundAmount}`);
  }

  // Generate refund ID
  const refundId = `REF_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

  // Update payment with refund information
  payment.refundInfo = {
    refundId,
    refundAmount,
    refundReason,
    refundStatus: 'pending',
    refundedAt: new Date()
  };

  // If full refund, update payment status
  if (refundAmount === payment.amount) {
    payment.paymentStatus = 'refunded';
  }

  await payment.save();

  res.json({
    success: true,
    message: 'Refund initiated successfully',
    refundId,
    payment
  });
});

const updatePaymentWithIds = async (req, res) => {
  try {
    const { vehicleId, personalDetailsId } = req.body;
    const paymentId = req.params.id;
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { 
        vehicleId, 
        personalDetailsId 
      },
      { new: true }
    );
    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createPayment,
  verifyUpiPayment,
  getPaymentById,
  getUserPayments,
  updatePaymentStatus,
  getPaymentStats,
  cancelPayment,
  processRefund,
  updatePaymentWithIds
};