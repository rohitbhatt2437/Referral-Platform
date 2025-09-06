import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/referrals/`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'x-auth-token': token } : {};
};

// Get the current user's referrals
const getMyReferrals = async () => {
  const config = { headers: getAuthHeader() };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Create a new referral
const createReferral = async (referralData) => {
  const config = { headers: getAuthHeader() };
  const response = await axios.post(API_URL, referralData, config);
  return response.data;
};

const getAllReferrals = async () => {
  const config = { headers: getAuthHeader() };
  const response = await axios.get(API_URL + 'all', config);
  return response.data;
};

// Apply to a referral
const applyToReferral = async (referralId) => {
  const config = { headers: getAuthHeader() };
  const response = await axios.post(API_URL + `apply/${referralId}`, {}, config);
  return response.data;
};

const updateReferralStatus = async (referralId, newStatus) => {
  const config = { headers: getAuthHeader() };
  const body = { status: newStatus };
  const response = await axios.put(API_URL + `status/${referralId}`, body, config);
  return response.data;
};

const getReferralById = async (referralId) => {
  const config = { headers: getAuthHeader() };
  const response = await axios.get(API_URL + referralId, config);
  return response.data;
};

const referralService = {
  getMyReferrals,
  createReferral,
  getAllReferrals,
  applyToReferral,
  updateReferralStatus,
  getReferralById
};

export default referralService;