import React, { useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography, Box } from '@mui/material';

const FinanceInformation = () => {
  const { control, setValue, formState: { errors } } = useFormContext();
  const [visitType, setVisitType] = useState('');
  const [visitPlace, setVisitPlace] = useState('');
  const [travelCost, setTravelCost] = useState(0);
  const [foodCost, setFoodCost] = useState(0);
  const [accommodationCost, setAccommodationCost] = useState(0);
  const [otherCost, setOtherCost] = useState(0);
  const [extraCostReason, setExtraCostReason] = useState('');
  const [totalCost, setTotalCost] = useState(0);

  const handleVisitTypeChange = (event) => {
    setVisitType(event.target.value);
  };

  const handleVisitPlaceChange = (event) => {
    setVisitPlace(event.target.value);
  };

  useEffect(() => {
    const total = travelCost + foodCost + accommodationCost + otherCost;
    setTotalCost(total);
    setValue('financeInformation', {
      visitType,
      visitPlace,
      totalCost: total.toFixed(2),
      travelCost: travelCost.toFixed(2),
      foodCost: foodCost.toFixed(2),
      accommodationCost: accommodationCost.toFixed(2),
      otherCost: otherCost.toFixed(2),
      extraCostReason
    });
  }, [travelCost, foodCost, accommodationCost, otherCost, extraCostReason, visitType, visitPlace, setValue]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Visit Finance Information
          </Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Visit Type</FormLabel>
            <Controller
              name="visitType"
              control={control}
              render={({ field }) => (
                <RadioGroup row {...field} onChange={(e) => { field.onChange(e); handleVisitTypeChange(e); }}>
                  <FormControlLabel value="online" control={<Radio />} label="Online" />
                  <FormControlLabel value="offline" control={<Radio />} label="Offline" />
                </RadioGroup>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item sm={6} xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Visit Place</FormLabel>
            <Controller
              name="visitPlace"
              control={control}
              render={({ field }) => (
                <RadioGroup row {...field} onChange={(e) => { field.onChange(e); handleVisitPlaceChange(e); }}>
                  <FormControlLabel value="factory" control={<Radio />} label="Factory" />
                  <FormControlLabel value="headOffice" control={<Radio />} label="Head Office" />
                </RadioGroup>
              )}
            />
          </FormControl>
        </Grid>
        {visitType === 'offline' && (
          <>
            <Grid item sm={6} xs={12}>
              <Typography variant="h6">Finance</Typography>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Typography variant="body1">Total Cost: {totalCost.toFixed(2)} Taka</Typography>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="travelCost"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      onChange={(e) => { field.onChange(e); setTravelCost(parseFloat(e.target.value) || 0); }}
                      label="Travel Cost"
                      placeholder="Type Travel Cost Here (0.00)"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="foodCost"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      onChange={(e) => { field.onChange(e); setFoodCost(parseFloat(e.target.value) || 0); }}
                      label="Food Cost"
                      placeholder="Type Food Cost Here (0.00)"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="accommodationCost"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      onChange={(e) => { field.onChange(e); setAccommodationCost(parseFloat(e.target.value) || 0); }}
                      label="Accommodation Cost"
                      placeholder="Type Accommodation Cost Here (0.00)"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="otherCost"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      onChange={(e) => { field.onChange(e); setOtherCost(parseFloat(e.target.value) || 0); }}
                      label="Other Cost"
                      placeholder="Type Extra Cost Here (0.00)"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="extraCostReason"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      onChange={(e) => { field.onChange(e); setExtraCostReason(e.target.value); }}
                      label="Reason for Extra Cost"
                      placeholder="Type Reasons of Extra Cost Here"
                      fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default FinanceInformation;
