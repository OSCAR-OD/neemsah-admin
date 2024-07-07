import React from 'react';
import { TextField } from '@mui/material';

const ShortAnswer = ({ value, onChange }) => (
  <TextField
    fullWidth
    variant="outlined"
    margin="dense"
    placeholder="Short answer text"
    value={value}
    onChange={onChange}
  />
);

export default ShortAnswer;
