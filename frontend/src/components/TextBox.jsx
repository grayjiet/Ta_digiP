import React from 'react';
import { TextField } from '@mui/material';

const ReusableTextBox = ({
  label,
  value,
  onChange,
  error,
  helperText,
  multiline = false,
  rows,
  slotProps = {},
}) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      error={Boolean(error)}
      helperText={error || helperText}
      fullWidth
      margin="normal"
      multiline={multiline}
      rows={rows}
      slotProps={{ input: slotProps.htmlInput }}
    />
  );
};

export default ReusableTextBox;