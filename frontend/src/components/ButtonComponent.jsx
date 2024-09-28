import React from 'react';
import { Button } from '@mui/material';

const ButtonComponent = ({ label, onClick, color = 'primary', variant = 'contained', style = {} }) => (
  <Button onClick={onClick} color={color} variant={variant} style={style}>
    {label}
  </Button>
);

export default ButtonComponent;