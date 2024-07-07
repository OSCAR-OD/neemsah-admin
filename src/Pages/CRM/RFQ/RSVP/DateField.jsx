import React from 'react';
import { TextField, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const DateField = ({ value, onChange }) => {
  const handleDateChange = (newValue) => {
    const formattedDate = newValue ? newValue.format('MM/DD/YYYY') : "";
    onChange(formattedDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ mt: 2, width: '100%' }}>
        <DatePicker
          sx={{ width: '100% !important' }}
          label="Date"
          value={value ? dayjs(value, 'MM-DD-YYYY') : null}
          onChange={handleDateChange}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              variant="outlined"
              margin="dense"
              InputLabelProps={{ shrink: true }}
            />
          )}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default DateField;
