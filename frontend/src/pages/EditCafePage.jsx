import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { updateCafe, fetchCafeById } from '../api/cafes';
import { Button, Typography, Snackbar, Alert, Box } from '@mui/material';
import TextFieldComponent from '../components/TextFieldComponent.jsx';

// Custom hook to handle the cafe update mutation
const useUpdateCafeMutation = (cafeId, navigate, queryClient, setIsDirty, setSnackbar) => {
  return useMutation({
    mutationFn: (newData) => updateCafe(cafeId, newData),
    onSuccess: () => {
      queryClient.invalidateQueries(['cafes']);
      setIsDirty(false);
      setSnackbar({
        open: true,
        message: 'Café updated successfully!',
        severity: 'success',
      });
      setTimeout(() => {
        navigate({ to: '/' }); // Update the path if necessary
      }, 1500);
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: 'Failed to update café. Please try again.',
        severity: 'error',
      });
    },
  });
};

const EditCafePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();

  // Extract the search parameters from the URL
  const searchParams = new URLSearchParams(location.search);
  const cafeId = searchParams.get('id');
  console.log('cafe id is ' + cafeId);
  // State variables for form inputs
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    location: '',
  });

  // State variable for form errors
  const [errors, setErrors] = useState({});

  // State to track if there are unsaved changes
  const [isDirty, setIsDirty] = useState(false);

  // State for Snackbar notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success' | 'error' | 'warning' | 'info'
  });

  // Fetch cafe data based on ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCafeById(cafeId);
        setFormData({
          name: data.name || '',
          description: data.description || '',
          logo: data.logo || '',
          location: data.location || '',
        });
      } catch (error) {
        console.error('Error fetching cafe:', error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch cafe data.',
          severity: 'error',
        });
      }
    };

    if (cafeId) {
      fetchData();
    }
  }, [cafeId]);

  // Use the custom mutation hook
  const updateCafeMutation = useUpdateCafeMutation(cafeId, navigate, queryClient, setIsDirty, setSnackbar);

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation
    const validationErrors = {};
    if (formData.name.trim().length < 6 || formData.name.trim().length > 20) { // Updated max length to 20
      validationErrors.name = 'Name must be between 6 and 20 characters'; // Update helper text accordingly
    }
    if (formData.description.trim().length > 256) {
      validationErrors.description = 'Description cannot exceed 256 characters';
    }
    if (!formData.location.trim()) {
      validationErrors.location = 'Location is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear errors and submit data
    setErrors({});
    updateCafeMutation.mutate(formData);
  };

  // Warn user about unsaved changes before closing or refreshing the browser/tab
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up the event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  // Handle input changes and mark the form as dirty
  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    setIsDirty(true);
  };

  // Handle navigation when clicking the Cancel button
  const handleCancel = () => {
    if (isDirty) {
      const confirmLeave = window.confirm('You have unsaved changes. Do you really want to leave?');
      if (confirmLeave) {
        navigate({ to: '/' }); // Update the path if necessary
      }
    } else {
      navigate({ to: '/' }); // Update the path if necessary
    }
  };

  // Handle closing the Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // If cafeId is not provided, show an error
  if (!cafeId) {
    return <div>No cafe ID provided.</div>;
  }

  return (
    <div className="edit-cafe-container">
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Café
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <TextFieldComponent
          label="Name"
          value={formData.name}
          onChange={handleInputChange('name')}
          error={errors.name}
          helperText="Minimum 6 characters, maximum 10 characters"
          inputProps={{ minLength: 6, maxLength: 10 }}
        />
        <TextFieldComponent
          label="Description"
          value={formData.description}
          onChange={handleInputChange('description')}
          error={errors.description}
          helperText="Maximum 256 characters"
          multiline
          rows={4}
          inputProps={{ maxLength: 256 }}
        />
        <TextFieldComponent
          label="Logo URL"
          value={formData.logo}
          onChange={handleInputChange('logo')}
          error={errors.logo}
          helperText=""
        />
        <TextFieldComponent
          label="Location"
          value={formData.location}
          onChange={handleInputChange('location')}
          error={errors.location}
          helperText=""
        />
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={updateCafeMutation.isLoading}
            style={{ marginRight: '10px' }}
          >
            {updateCafeMutation.isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      </form>
      {/* Snackbar for notifications
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar> */}
    </div>
  );
};

export default EditCafePage;