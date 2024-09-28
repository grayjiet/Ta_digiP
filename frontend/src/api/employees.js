import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';

// Fetch employees, optionally filtered by cafe
export const fetchEmployees = async (cafe) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/employees`, {
      params: { cafe },
    });
    console.log('fetchEmployees axios response:', response.data.employees);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw new Error('Failed to fetch employees.');
  }
};

// Fetch an employee by their ID
export const fetchEmployeeById = async (employeeId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching employee:', error);
    throw new Error('Failed to fetch employee.');
  }
};

// Create a new employee
export const createEmployee = async (employeeData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/employee`, employeeData);
    return response.data;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw new Error('Failed to create employee.');
  }
};

// Update an existing employee by ID
export const updateEmployee = async (employeeId, employeeData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/employee/${employeeId}`, employeeData);
    return response.data;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw new Error('Failed to update employee.');
  }
};

// Delete an employee by ID
export const deleteEmployee = async (employeeId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/employee/${employeeId}`);
    console.log(`Axios Deleted employee with ID: ${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw new Error('Failed to delete employee.');
  }
};