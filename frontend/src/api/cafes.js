import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Fetch all cafes, optionally filtered by location
export const fetchCafes = async (location) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cafes`, {
      params: { location }, // Optional location
    });
    console.log('fetchCafes response:', response);
    return response.data;  // Return the response data directly
  } catch (error) {
    console.error('Error fetching cafes:', error);
    throw error;  // Rethrow the error to be handled by the caller
  }
};

// Fetch a cafe by their id
export const fetchCafeById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cafe/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cafe:', error);
    throw error;
  }
};

// Create a new cafe
export const createCafe = async (cafeData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cafe`, cafeData);
    return response.data;
  } catch (error) {
    console.error('Error creating cafe:', error);
    throw error;
  }
};

// Update an existing cafe by ID
export const updateCafe = async (cafeId, cafeData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/cafe/${cafeId}`, cafeData);
    return response.data;
  } catch (error) {
    console.error('Error updating cafe:', error);
    throw error;
  }
};

// Delete a cafe by ID
export const deleteCafe = async (cafeId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/cafe/${cafeId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting cafe:', error);
    throw error;
  }
};