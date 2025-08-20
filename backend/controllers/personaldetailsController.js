const UserDetails = require('../models/personaldetailsModel');

// Create new user details
const createUserDetails = async (req, res) => {
  try {
    const userDetails = await UserDetails.create(req.body);
    res.status(201).json(userDetails);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user details by authUserId
const getUserDetailsByAuthUserId = async (req, res) => {
  try {
    const userDetails = await UserDetails.findOne({ authUserId: req.params.id });
    if (!userDetails) return res.status(404).json({ message: 'User details not found' });
    res.status(200).json(userDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update KYC status
const updateKycStatus = async (req, res) => {
  try {
    const updated = await UserDetails.findOneAndUpdate(
      { authUserId: req.params.id },
      { kycStatus: req.body.kycStatus },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createUserDetails,
  getUserDetailsByAuthUserId,
  updateKycStatus
};
