import React from 'react';
import { TextField, Box, IconButton } from '@mui/material';
import { MdAddCircleOutline, MdRemoveCircleOutline } from "react-icons/md";

const Checkbox = ({ options, onChange, onAddOption, onRemoveOption }) => (
  <Box>
    {options.map((option, index) => (
      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          margin="dense"
          placeholder={`Checkbox Field Name ${index + 1}`}
          value={option}
          onChange={(e) => onChange(e, index)}
        />
        <IconButton onClick={() => onRemoveOption(index)}>
          <MdRemoveCircleOutline />
        </IconButton>
      </Box>
    ))}
    <IconButton onClick={onAddOption}>
      <MdAddCircleOutline />
    </IconButton>
  </Box>
);

export default Checkbox;