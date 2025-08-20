// features/vehicle/vehicleService.js
import axios from 'axios';

const API_URL = '/api/vehicles/';

// Create vehicle
const createVehicle = async (vehicleData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, vehicleData, config);

  return response.data;
};

// Get all vehicles
const getVehicles = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);

  return response.data;
};

// Get vehicle by ID
const getVehicle = async (vehicleId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + vehicleId, config);

  return response.data;
};

// Update vehicle
const updateVehicle = async (vehicleId, vehicleData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + vehicleId, vehicleData, config);

  return response.data;
};

// Delete vehicle
const deleteVehicle = async (vehicleId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + vehicleId, config);

  return response.data;
};

const vehicleService = {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
};

export default vehicleService;