const express = require('express');
const router = express.Router();
const {
  createUserDetails,
  getUserDetailsByAuthUserId,
  updateKycStatus
} = require('../controllers/personaldetailsController');

// POST /api/user-details
router.post('/', createUserDetails);

// GET /api/user-details/:id
router.get('/:id', getUserDetailsByAuthUserId);

// PATCH /api/user-details/:id/kyc
router.patch('/:id/kyc', updateKycStatus);

module.exports = router;
