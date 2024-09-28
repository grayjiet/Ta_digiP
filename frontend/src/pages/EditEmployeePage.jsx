import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TextField, Button, CircularProgress, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { fetchEmployeeById, updateEmployee } from '../api/employees';
import { fetchCafes } from '../api/cafes';  // Import the fetchCafes function


const EditEmployee = () => {
  const navigate = useNavigate();
  const { id: employeeId } = useParams({ from: '/employee/edit/$id' });
  const queryClient = useQueryClient();

  // Fetch the employee details using React Query
  const { data: employeeData, isLoading: isLoadingEmployee, error: errorEmployee } = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: () => fetchEmployeeById(employeeId),
    enabled: !!employeeId,
  });

  // Fetch the list of cafés
  const { data: cafesData, isLoading: isLoadingCafes, error: errorCafes } = useQuery({
    queryKey: ['cafes'],
    queryFn: fetchCafes,
  });

  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email_address: '',
    phone_number: '',
    gender: '',
    start_date: '',
    cafe_id: '',
    days_worked: '',
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    phone_number: '',
  });

  useEffect(() => {
    if (employeeData) {
      // Pre-fill form with fetched employee data
      setFormData({
        name: employeeData.name || '',
        email_address: employeeData.email_address || '',
        phone_number: employeeData.phone_number || '',
        gender: employeeData.gender || '',
        start_date: employeeData.start_date || '',
        cafe_id: employeeData.cafe_id || '',
        days_worked: employeeData.days_worked || '',
      });
    }
  }, [employeeData]);

  // Mutation to update the employee details
  const updateMutation = useMutation({
    mutationFn: (updatedEmployee) => updateEmployee(employeeId, updatedEmployee),
    onError: (error) => console.error('Error updating employee:', error),
    onSuccess: () => {
      queryClient.invalidateQueries(['employee', employeeId]);
      navigate({ to: '/employee' });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[89]\d{7,8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone_number: 'Phone number must start with 8 or 9 and be 8-9 digits long.',
      }));
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isPhoneValid = validatePhoneNumber(formData.phone_number);

    if (!isPhoneValid) return;

    updateMutation.mutate(formData);
  };

  if (isLoadingEmployee || isLoadingCafes) return <CircularProgress />;
  if (errorEmployee || errorCafes) return <div>Error loading data.</div>;

  return (
    <div>
      <h1>Edit Employee</h1>
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
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="gender-label">Gender</InputLabel>
          <Select
            labelId="gender-label"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            fullWidth
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Start Date"
          name="start_date"
          type="date"
          value={formData.start_date}
          onChange={handleInputChange}
          required
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="cafe-label">Café</InputLabel>
          <Select
            labelId="cafe-label"
            name="cafe_id"
            value={formData.cafe_id}
            onChange={handleInputChange}
            fullWidth
          >
            {cafesData?.cafes.map((cafe) => (
              <MenuItem key={cafe.id} value={cafe.id}>
                {cafe.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Days Worked"
          name="days_worked"
          value={formData.days_worked}
          onChange={handleInputChange}
          required
          fullWidth
          margin="normal"
        />

        <Button type="submit" variant="contained" color="primary">
          Save Changes
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
  );
};

export default EditEmployee;