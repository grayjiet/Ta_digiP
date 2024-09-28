import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from '@tanstack/react-router';
import { createEmployee } from '../api/employees';
import { fetchCafes } from '../api/cafes';

const AddEmployee = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    email_address: '',
    phone_number: '',
    gender: '',
    start_date: null,
    cafe_id: ''
  });

  const [errors, setErrors] = useState({});
  const [selectedCafe, setSelectedCafe] = useState('');
  const [cafes, setCafes] = useState([]);

  useEffect(() => {
    const fetchCafesData = async () => {
      try {
        const cafeData = await fetchCafes();
        setCafes(cafeData.cafes);
      } catch (error) {
        console.error('Error fetching cafés:', error);
      }
    };

    fetchCafesData();
  }, [selectedCafe]);

  const createMutation = useMutation({
    mutationFn: (newEmployee) => createEmployee(newEmployee),
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
      navigate('/employees');
    },
  });

  // Phone number validation logic
  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[89][0-9]{7,8}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'email_address') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email_address: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address',
      }));
    }

    if (name === 'phone_number') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone_number: validatePhoneNumber(value) ? '' : 'Phone number must start with 8 or 9 and be 8-9 digits long',
      }));
    }
  };

  const handleCafeChange = (e) => {
    const selectedCafeName = e.target.value;
    setSelectedCafe(selectedCafeName);

    const selectedCafeData = cafes.find((cafe) => cafe.name === selectedCafeName);

    if (selectedCafeData) {
      setFormData((prevData) => ({
        ...prevData,
        cafe_id: selectedCafeData.id,
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      start_date: date.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for validation errors before submitting
    if (errors.email_address || errors.phone_number) {
      alert('Please fix the errors in the form before submitting.');
      return;
    }

    if (!validatePhoneNumber(formData.phone_number)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone_number: 'Phone number must start with 8 or 9 and be 8-9 digits long',
      }));
      return;
    }

    createMutation.mutate(formData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div>
        <h1>Add New Employee</h1>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email Address"
            name="email_address"
            value={formData.email_address}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
            error={!!errors.email_address}
            helperText={errors.email_address}
          />
          <TextField
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
            error={!!errors.phone_number}
            helperText={errors.phone_number}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Gender</InputLabel>
            <Select
              value={formData.gender}
              onChange={handleInputChange}
              name="gender"
              required
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <DesktopDatePicker
              label="Start Date"
              inputFormat="yyyy-MM-dd"
              value={formData.start_date}
              onChange={handleDateChange}
              slots={{
                textField: (params) => <TextField {...params} required />,
              }}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Café Name</InputLabel>
            <Select
              value={selectedCafe}
              onChange={handleCafeChange}
              required
            >
              {Array.isArray(cafes) && cafes.length > 0 ? (
                cafes.map((cafe) => (
                  <MenuItem key={cafe.id} value={cafe.name}>
                    {cafe.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No Cafés Available</MenuItem>
              )}
            </Select>
          </FormControl>

          <TextField
            label="Café ID"
            name="cafe_id"
            value={formData.cafe_id}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
            disabled
          />
          <Button type="submit" variant="contained" color="primary">
            Add Employee
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate({ to: '/employee' })}
            style={{ marginLeft: '10px' }}
          >
            Cancel
          </Button>
        </form>
      </div>
    </LocalizationProvider>
  );
};

export default AddEmployee;