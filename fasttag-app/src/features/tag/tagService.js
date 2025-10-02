// // features/tags/tagService.js
// import axios from 'axios';

// const API_URL = '/api/tags/';

// const createTagFromPayment = async (tagData, token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     },
//   };

//   console.log('tagService - Sending to backend:', tagData);

//   const response = await axios.post(API_URL + 'create-from-payment', tagData, config);
  
//   console.log('tagService - Response:', response.data);
  
//   return response.data;
// };
// // Get user tags
// const getUserTags = async (token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };

//   const response = await axios.get(API_URL, config);
//   return response.data;
// };

// // Get tag by ID
// const getTagById = async (tagId, token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };

//   const response = await axios.get(API_URL + tagId, config);
//   return response.data;
// };

// // Get tag by vehicle registration
// const getTagByVehicle = async (regNumber, token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };

//   const response = await axios.get(API_URL + 'vehicle/' + regNumber, config);
//   return response.data;
// };

// // Recharge tag
// const rechargeTag = async (tagId, rechargeData, token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };

//   const response = await axios.post(API_URL + tagId + '/recharge', rechargeData, config);
//   return response.data;
// };

// // Get tag transactions
// const getTagTransactions = async (tagId, params, token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     params: params,
//   };

//   const response = await axios.get(API_URL + tagId + '/transactions', config);
//   return response.data;
// };

// // Toggle tag block status
// const toggleTagBlockStatus = async (tagId, blockData, token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };

//   const response = await axios.put(API_URL + tagId + '/block', blockData, config);
//   return response.data;
// };

// // Get user tag statistics
// const getUserTagStats = async (token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };

//   const response = await axios.get(API_URL + 'stats', config);
//   return response.data;
// };

// // Delete tag
// const deleteTag = async (tagId, token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };

//   const response = await axios.delete(API_URL + tagId, config);
//   return response.data;
// };

// const tagService = {
//   createTagFromPayment,
//   getUserTags,
//   getTagById,
//   getTagByVehicle,
//   rechargeTag,
//   getTagTransactions,
//   toggleTagBlockStatus,
//   getUserTagStats,
//   deleteTag,
// };

// export default tagService;
import axios from 'axios';

const API_URL = '/api/tags/';

const createTagFromPayment = async (tagData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  };

  console.log('tagService - Sending to backend:', tagData);

  const response = await axios.post(API_URL + 'create-from-payment', tagData, config);
  
  console.log('tagService - Response:', response.data);
  
  return response.data;
};

const getUserTags = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache' // Force fresh data
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

const getTagById = async (tagId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + tagId, config);
  return response.data;
};

const getTagByVehicle = async (regNumber, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + 'vehicle/' + regNumber, config);
  return response.data;
};

const rechargeTag = async (tagId, rechargeData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + tagId + '/recharge', rechargeData, config);
  return response.data;
};

const getTagTransactions = async (tagId, params, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: params,
  };

  const response = await axios.get(API_URL + tagId + '/transactions', config);
  return response.data;
};

const toggleTagBlockStatus = async (tagId, blockData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + tagId + '/block', blockData, config);
  return response.data;
};

const getUserTagStats = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache'
    },
  };

  const response = await axios.get(API_URL + 'stats', config);
  return response.data;
};

const deleteTag = async (tagId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + tagId, config);
  return response.data;
};

const tagService = {
  createTagFromPayment,
  getUserTags,
  getTagById,
  getTagByVehicle,
  rechargeTag,
  getTagTransactions,
  toggleTagBlockStatus,
  getUserTagStats,
  deleteTag,
};

export default tagService;