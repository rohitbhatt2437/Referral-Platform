import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/profile/`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'x-auth-token': token } : {};
};

// Get the current user's profile
const getMyProfile = async () => {
  const config = { headers: getAuthHeader() };
  const response = await axios.get(API_URL + 'me', config);
  return response.data;
};

// Create or update a profile
const createOrUpdateProfile = async (profileData) => {
  const config = { headers: getAuthHeader() };
  const response = await axios.post(API_URL, profileData, config);
  return response.data;
};


const profileService = {
  getMyProfile,
  createOrUpdateProfile,
};

export default profileService;