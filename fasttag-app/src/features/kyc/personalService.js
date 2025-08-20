// features/kyc/personalService.js
import axios from 'axios';

const API_URL = '/api/user-details/';

// Create personal details
const createPersonalDetails = async (personalData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, personalData, config);

  return response.data;
};

// Get personal details by auth user ID
const getPersonalDetails = async (authUserId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + authUserId, config);

  return response.data;
};

// Update KYC status
const updateKycStatus = async (id, kycStatus, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.patch(
    API_URL + id + '/kyc',
    { kycStatus },
    config
  );

  return response.data;
};

const personalService = {
  createPersonalDetails,
  getPersonalDetails,
  updateKycStatus,
};

export default personalService;