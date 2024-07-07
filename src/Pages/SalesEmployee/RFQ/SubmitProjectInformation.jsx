import React, { useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, Grid, FormControl, FormLabel, FormHelperText, FormControlLabel, Radio, RadioGroup, Autocomplete, Box, Button } from '@mui/material';
import { getApiHandler, postApiHandler } from "../../../lib/axios/ApiHelper";
import { useAuth } from "../../../Context/Auth/UseAuth";
import { toast } from "react-toastify";
const radioOptions = [
  { label: 'Quotation Required', value: 'Quotation' },
  { label: 'Revised Quotation Required', value: 'revisedQuotationRequired' },
  { label: 'PI Required', value: 'piRequired' },
  { label: 'Revised PI Required', value: 'revisedPiRequired' },
  { label: 'LC Open', value: 'lcOpen' },
  { label: 'None', value: 'none' },
];

const SubmitProjectInformation = ({ setFlagValue }) => {
  const { user } = useAuth();
  const { control, setValue, formState: { errors } } = useFormContext();
  const [projectNameOptions, setProjectNameOptions] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filteredApplicationOptions, setFilteredApplicationOptions] = useState([]);

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid item xs={12}>
        <FormControl component="fieldset" error={!!errors.flags}>
          <FormLabel>Flags</FormLabel>
          <Controller
            name="flags"
            control={control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setFlagValue(e.target.value);
                }}
              >
                {radioOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            )}
          />
          <FormHelperText>{errors.flags ? errors.flags.message : ''}</FormHelperText>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default SubmitProjectInformation;
