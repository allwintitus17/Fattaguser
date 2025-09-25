// features/payment/paymentService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payments/';

// Create payment
const createPayment = async (paymentData, token) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const response = await axios.post(API_URL + 'create', paymentData, config);
  return response.data;
};

// Verify UPI payment
const verifyUpiPayment = async (paymentData, token) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const response = await axios.post(API_URL + 'verify-upi', paymentData, config);
  return response.data;
};

// Get payment by ID
const getPaymentById = async (paymentId, token) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const response = await axios.get(API_URL + paymentId, config);
  return response.data;
};

// Get user payments
const getUserPayments = async (token) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const response = await axios.get(API_URL + 'user', config);
  return response.data;
};

// Update payment status
const updatePaymentStatus = async (paymentId, statusData, token) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const response = await axios.patch(API_URL + paymentId + '/status', statusData, config);
  return response.data;
};
// Update payment with vehicle and personal details IDs
const updatePaymentWithIds = async (paymentId, updateData, token) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const response = await axios.patch(API_URL + paymentId + '/update-ids', updateData, config);
  return response.data;
};

// Add this to your paymentService exports
const paymentService = {
  createPayment,
  verifyUpiPayment,
  getPaymentById,
  getUserPayments,
  updatePaymentStatus,
  updatePaymentWithIds  // Add this new method
};

export default paymentService;