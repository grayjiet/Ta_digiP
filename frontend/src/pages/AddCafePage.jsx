import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCafe } from '../api/cafes';
import { useNavigate } from '@tanstack/react-router';
import { Button, Typography } from '@mui/material';
import TextFieldComponent from '../components/TextFieldComponent.jsx';

const AddCafePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State variables for form inputs
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  // State variable for form errors
  const [errors, setErrors] = useState({});

  // State to track if there are unsaved changes
  const [isDirty, setIsDirty] = useState(false);

  // Mutation for creating a new cafe
  const createCafeMutation = useMutation({
    mutationFn: createCafe,
    onSuccess: () => {
      // Invalidate and refetch cafes list
      queryClient.invalidateQueries(['cafes']);
      // Reset form fields
      setName('');
      setDescription('');
      setLocation('');
      // Reset dirty state
      setIsDirty(false);
      // Show success notification
      window.alert('Café added successfully!');
      // Navigate back to the cafes list
      navigate({ to: '/' }); // Update the path if necessary
    },
    onError: (error) => {
      // Show error notification
      window.alert('Failed to add café. Please try again.');
    },
  });

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation
    const validationErrors = {};
    if (name.trim().length < 6 || name.trim().length > 10) {
      validationErrors.name = 'Name must be between 6 and 10 characters';
    }
    if (description.trim().length > 256) {
      validationErrors.description = 'Description cannot exceed 256 characters';
    }
    if (!location.trim()) {
      validationErrors.location = 'Location is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear errors and submit data
    setErrors({});
    const cafeData = { name, description, location };
    createCafeMutation.mutate(cafeData);
  };

  // Warn user about unsaved changes before closing or refreshing the browser/tab
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up the event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  // Handle input changes and mark the form as dirty
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
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

  // Render the form
  return (
    <div className="add-cafe-page">
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Café
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <TextFieldComponent
          label="Name"
          value={name}
          onChange={handleInputChange(setName)}
          error={errors.name}
          helperText="Minimum 6 characters, maximum 10 characters"
          inputProps={{ minLength: 6, maxLength: 10 }}
        />
        <TextFieldComponent
          label="Description"
          value={description}
          onChange={handleInputChange(setDescription)}
          error={errors.description}
          helperText="Maximum 256 characters"
          multiline
          rows={4}
          inputProps={{ maxLength: 256 }}
        />
        <TextFieldComponent
          label="Location"
          value={location}
          onChange={handleInputChange(setLocation)}
          error={errors.location}
          helperText=""
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={createCafeMutation.isLoading}
          style={{ marginTop: '20px', marginRight: '10px' }}
        >
          {createCafeMutation.isLoading ? 'Adding...' : 'Submit'}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          style={{ marginTop: '20px' }}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default AddCafePage;