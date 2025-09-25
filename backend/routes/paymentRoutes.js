// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const {
  createPayment,
  verifyUpiPayment,
  getPaymentById,
  getUserPayments,
  updatePaymentStatus,
  getPaymentStats,
  cancelPayment,
  processRefund,
 updatePaymentWithIds
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(protect);

// Payment CRUD operations
router.post('/create', createPayment);
router.post('/verify-upi', verifyUpiPayment);
router.get('/user', getUserPayments);
router.get('/stats', getPaymentStats);
router.get('/:id', getPaymentById);

// Payment status management
router.patch('/:id/status', updatePaymentStatus);
router.patch('/:id/cancel', cancelPayment);
router.post('/:id/refund', processRefund);
router.patch('/:id/update-ids', protect, updatePaymentWithIds);

module.exports = router;