import React from 'react';
import { TextField } from '@mui/material';

const TextFieldComponent = ({ label, name, value, onChange, required = false, disabled = false, error }) => (
  <TextField
    label={label}
    name={name}
    value={value}
    onChange={onChange}
    required={required}
    fullWidth
    margin="normal"
    disabled={disabled}
    error={!!error}
    helperText={error}
  />
);

export default TextFieldComponent;