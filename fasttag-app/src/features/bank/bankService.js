// features/bank/bankService.js
import axios from 'axios';

const API_URL = '/api/bank-details/';

// Create bank details
const createBankDetails = async (bankData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, bankData, config);

  return response.data;
};

// Get bank details by owner ID
const getBankDetails = async (ownerId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + ownerId, config);

  return response.data;
};

// Update bank details
const updateBankDetails = async (bankId, bankData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + bankId, bankData, config);

  return response.data;
};

// Delete bank details
const deleteBankDetails = async (bankId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + bankId, config);

  return response.data;
};

// Verify bank details
const verifyBankDetails = async (bankId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.patch(API_URL + bankId + '/verify', {}, config);

  return response.data;
};

const bankService = {
  createBankDetails,
  getBankDetails,
  updateBankDetails,
  deleteBankDetails,
  verifyBankDetails,
};

export default bankService;