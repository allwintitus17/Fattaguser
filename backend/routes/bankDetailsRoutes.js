// routes/bankDetailsRoutes.js
const express = require('express');
const router = express.Router();
const {
  createBankDetails,
  getBankDetailsByOwnerId,
  updateBankDetails,
  deleteBankDetails,
  verifyBankDetails
} = require('../controllers/bankDetailsController');

// POST /api/bank-details
router.post('/', createBankDetails);

// GET /api/bank-details/:ownerId
router.get('/:ownerId', getBankDetailsByOwnerId);

// PUT /api/bank-details/:id
router.put('/:id', updateBankDetails);

// DELETE /api/bank-details/:id
router.delete('/:id', deleteBankDetails);

// PATCH /api/bank-details/:id/verify (Admin only)
router.patch('/:id/verify', verifyBankDetails);

module.exports = router;