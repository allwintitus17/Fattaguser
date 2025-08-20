// controllers/bankDetailsController.js
const asyncHandler = require('express-async-handler');
const BankDetails = require('../models/bankDetailsModel');

// @desc    Create bank details
// @route   POST /api/bank-details
// @access  Private
const createBankDetails = asyncHandler(async (req, res) => {
  const {
    ownerId,
    accountHolderName,
    accountNumber,
    confirmAccountNumber,
    ifscCode,
    bankName,
    branchName,
    upiId,
    linkedMobileNumber,
    accountType,
    consentToDebit
  } = req.body;

  // Validation
  if (
    !ownerId ||
    !accountHolderName ||
    !accountNumber ||
    !confirmAccountNumber ||
    !ifscCode ||
    !bankName ||
    !linkedMobileNumber ||
    !accountType ||
    consentToDebit !== true
  ) {
    res.status(400);
    throw new Error('Please provide all required fields and consent to debit');
  }

  // Check if account numbers match
  if (accountNumber !== confirmAccountNumber) {
    res.status(400);
    throw new Error('Account numbers do not match');
  }

  // Check if bank details already exist for this user
  const existingBankDetails = await BankDetails.findOne({ ownerId });
  if (existingBankDetails) {
    res.status(400);
    throw new Error('Bank details already exist for this user');
  }

  // Check for duplicate account number
  const existingAccount = await BankDetails.findOne({ accountNumber });
  if (existingAccount) {
    res.status(400);
    throw new Error('Account number already registered');
  }

  // Validate account number format
  const accountNumberRegex = /^\d{9,18}$/;
  if (!accountNumberRegex.test(accountNumber)) {
    res.status(400);
    throw new Error('Account number must be 9-18 digits');
  }

  // Validate IFSC code format
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  if (!ifscRegex.test(ifscCode)) {
    res.status(400);
    throw new Error('Invalid IFSC code format');
  }

  // Validate mobile number format
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(linkedMobileNumber)) {
    res.status(400);
    throw new Error('Invalid mobile number format');
  }

  // Validate UPI ID format if provided
  if (upiId) {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-]{2,64}$/;
    if (!upiRegex.test(upiId)) {
      res.status(400);
      throw new Error('Invalid UPI ID format');
    }
  }

  try {
    const bankDetails = await BankDetails.create({
      ownerId,
      accountHolderName,
      accountNumber,
      confirmAccountNumber, // Will be removed by pre-save hook
      ifscCode: ifscCode.toUpperCase(),
      bankName,
      branchName,
      upiId,
      linkedMobileNumber,
      accountType,
      consentToDebit,
    });

    // Populate owner details
    await bankDetails.populate('ownerId', 'name email');

    res.status(201).json({
      success: true,
      data: bankDetails,
      message: 'Bank details added successfully',
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Get bank details by owner ID
// @route   GET /api/bank-details/:ownerId
// @access  Private
const getBankDetailsByOwnerId = asyncHandler(async (req, res) => {
  const bankDetails = await BankDetails.findOne({ 
    ownerId: req.params.ownerId 
  }).populate('ownerId', 'name email');

  if (!bankDetails) {
    res.status(404);
    throw new Error('Bank details not found');
  }

  res.status(200).json({
    success: true,
    data: bankDetails,
  });
});

// @desc    Update bank details
// @route   PUT /api/bank-details/:id
// @access  Private
const updateBankDetails = asyncHandler(async (req, res) => {
  let bankDetails = await BankDetails.findById(req.params.id);

  if (!bankDetails) {
    res.status(404);
    throw new Error('Bank details not found');
  }

  // If updating account number, check for duplicates
  if (req.body.accountNumber && req.body.accountNumber !== bankDetails.accountNumber) {
    const existingAccount = await BankDetails.findOne({ 
      accountNumber: req.body.accountNumber,
      _id: { $ne: req.params.id }
    });
    if (existingAccount) {
      res.status(400);
      throw new Error('Account number already registered');
    }
  }

  // Convert IFSC to uppercase if provided
  if (req.body.ifscCode) {
    req.body.ifscCode = req.body.ifscCode.toUpperCase();
  }

  bankDetails = await BankDetails.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('ownerId', 'name email');

  res.status(200).json({
    success: true,
    data: bankDetails,
    message: 'Bank details updated successfully',
  });
});

// @desc    Delete bank details
// @route   DELETE /api/bank-details/:id
// @access  Private
const deleteBankDetails = asyncHandler(async (req, res) => {
  const bankDetails = await BankDetails.findById(req.params.id);

  if (!bankDetails) {
    res.status(404);
    throw new Error('Bank details not found');
  }

  await BankDetails.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: { id: req.params.id },
    message: 'Bank details deleted successfully',
  });
});

// @desc    Verify bank details
// @route   PATCH /api/bank-details/:id/verify
// @access  Private (Admin only)
const verifyBankDetails = asyncHandler(async (req, res) => {
  const bankDetails = await BankDetails.findByIdAndUpdate(
    req.params.id,
    { isVerified: true },
    { new: true, runValidators: true }
  ).populate('ownerId', 'name email');

  if (!bankDetails) {
    res.status(404);
    throw new Error('Bank details not found');
  }

  res.status(200).json({
    success: true,
    data: bankDetails,
    message: 'Bank details verified successfully',
  });
});

module.exports = {
  createBankDetails,
  getBankDetailsByOwnerId,
  updateBankDetails,
  deleteBankDetails,
  verifyBankDetails,
};