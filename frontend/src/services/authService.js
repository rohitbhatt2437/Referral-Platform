import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import the decoder

const API_URL = 'http://localhost:5000/api/auth/';

// Helper function to handle successful authentication
const handleAuthSuccess = (token) => {
  // 1. Decode the token to get the payload
  const decoded = jwtDecode(token);
  // 2. Save the token and the user's ID to localStorage
  localStorage.setItem('token', token);
  localStorage.setItem('userId', decoded.user.id);
};

// Register a new user
const signup = async (userData) => {
  const response = await axios.post(API_URL + 'signup', userData);
  if (response.data.token) {
    handleAuthSuccess(response.data.token);
  }
  return response.data;
};

// Login a user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  if (response.data.token) {
    handleAuthSuccess(response.data.token);
  }
  return response.data;
};

// Logout a user
const logout = () => {
  // Remove both the token and the user ID
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
};

// Function to get the current user's ID
const getCurrentUserId = () => {
  return localStorage.getItem('userId');
};

const authService = {
  signup,
  login,
  logout,
  getCurrentUserId, // Export the new function
};

export default authService;