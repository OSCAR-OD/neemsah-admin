import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, FormControl, FormLabel, FormHelperText, Autocomplete } from '@mui/material';
import { getApiHandler } from "../../../lib/axios/ApiHelper";

const ContactCreateModal = ({ open, onClose, onSave }) => {
  const [companyNames, setCompanyNames] = useState([]);
  const { control, setValue, handleSubmit, formState: { errors } } = useForm();

  const getCompanyName = async () => {
    return await getApiHandler("/admin/crm/allCustomers");
  };

  const getCompany = async () => {
    const res = await getCompanyName();
    if (res?.success) {
      setCompanyNames(res.data);
    }
  };

  const handleCmpnyChange = (event, newValue) => {
    setValue('companyName', newValue?.companyName || '');
    setValue('cid', newValue?.cid || '');
  };

  useEffect(() => {
    getCompany();
  }, []);

  const onSubmit = (data) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Contact</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.contactName}>
                <FormLabel>Contact Name</FormLabel>
                <Controller
                  name="contactName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      error={!!errors.contactName}
                    />
                  )}
                />
                <FormHelperText>{errors.contactName ? errors.contactName.message : ''}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.companyName}>
                <FormLabel>Company Name</FormLabel>
                <Controller
                  name="companyName"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={companyNames}
                      getOptionLabel={(option) => option.companyName}
                      onChange={handleCmpnyChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Company"
                          error={!!errors.companyName}
                          variant="outlined"
                        />
                      )}
                    />
                  )}
                />
                <FormHelperText>{errors.companyName ? errors.companyName.message : ''}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.designation}>
                <FormLabel>Designation</FormLabel>
                <Controller
                  name="designation"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      error={!!errors.designation}
                    />
                  )}
                />
                <FormHelperText>{errors.designation ? errors.designation.message : ''}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.contactPhone}>
                <FormLabel>Contact Phone</FormLabel>
                <Controller
                  name="contactPhone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      error={!!errors.contactPhone}
                    />
                  )}
                />
                <FormHelperText>{errors.contactPhone ? errors.contactPhone.message : ''}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.contactEmail}>
                <FormLabel>Contact Email</FormLabel>
                <Controller
                  name="contactEmail"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      error={!!errors.contactEmail}
                    />
                  )}
                />
                <FormHelperText>{errors.contactEmail ? errors.contactEmail.message : ''}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.note}>
                <FormLabel>Division</FormLabel>
                <Controller
                  name="note"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      error={!!errors.note}
                    />
                  )}
                />
                <FormHelperText>{errors.note ? errors.note.message : ''}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} color="primary">Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactCreateModal;
