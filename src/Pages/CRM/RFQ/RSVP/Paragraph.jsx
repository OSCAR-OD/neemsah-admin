import React from 'react';
import { TextField } from '@mui/material';

const Paragraph = ({ value, onChange }) => (
  <TextField
    fullWidth
    variant="outlined"
    margin="dense"
    placeholder="Paragraph text"
    multiline
    rows={4}
    value={value}
    onChange={onChange}
  />
);

export default Paragraph;
