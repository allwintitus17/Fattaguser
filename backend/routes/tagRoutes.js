// Add this to your existing app.js or server.js file

// Import the tag routes



// If you don't have the routes file yet, here it is:
// routes/tagRoutes.js
const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/tagController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// @route   POST /api/tags/create-from-payment
// @desc    Create FastTag from successful payment (most important route)
router.post('/create-from-payment', createTagFromPayment);

// @route   POST /api/tags
// @desc    Create new FastTag manually
router.post('/', createTag);

// @route   GET /api/tags
// @desc    Get all user tags
router.get('/', getUserTags);

// @route   GET /api/tags/stats
// @desc    Get user tag statistics
router.get('/stats', getUserTagStats);

// @route   GET /api/tags/:tagId
// @desc    Get single tag by ID
router.get('/:tagId', getTagById);

// @route   GET /api/tags/vehicle/:regNumber
// @desc    Get tag by vehicle registration number
router.get('/vehicle/:regNumber', getTagByVehicle);

// @route   POST /api/tags/:tagId/recharge
// @desc    Recharge FastTag balance
router.post('/:tagId/recharge', rechargeTag);

// @route   GET /api/tags/:tagId/transactions
// @desc    Get tag transaction history
router.get('/:tagId/transactions', getTagTransactions);

// @route   PUT /api/tags/:tagId/block
// @desc    Block/Unblock FastTag
router.put('/:tagId/block', toggleTagBlockStatus);

// @route   DELETE /api/tags/:tagId
// @desc    Delete FastTag
router.delete('/:tagId', deleteTag);

module.exports = router;