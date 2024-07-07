import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, FormControl, FormLabel, FormHelperText, Autocomplete, Typography } from '@mui/material';
import { getApiHandler } from "../../../lib/axios/ApiHelper";

const ProjectCreateModal = ({ open, onClose, onSave }) => {
  const [companyNames, setCompanyNames] = useState([]);
  const { control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  }
    = useForm();

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
    setValue('company', newValue?.customID || '');
  };

  useEffect(() => {
    getCompany();
  }, []);

  const projectNameValue = watch("projectName", "");

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const date = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');

    const pid = `${projectNameValue.replace(/ /g, '-').toUpperCase()}-${year}${date}${month}`;
    setValue("pid", pid);
  }, [projectNameValue, setValue]);

  const onSubmit = (data) => {
    onSave(data);
     onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Project</DialogTitle>
      <DialogContent >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth error={!!errors.projectName}>
                <FormLabel>Project Name</FormLabel>
                <Controller
                  name="projectName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      error={!!errors.projectName}
                    />
                  )}
                />
                <FormHelperText>{errors.projectName ? errors.projectName.message : ''}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Controller
                render={({ field, formState }) => (
                  <FormControl fullWidth variant="outlined">
                     <FormLabel>PID (YY-DD-MM)</FormLabel>
                    <TextField
                      {...field}
                      error={!!formState.errors?.pid}
                      placeholder="PID"
                    />
                    {!!formState.errors?.pid ? (
                      <FormHelperText error>
                        {errors?.pid?.message}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                )}
                name="pid"
                control={control}
                defaultValue=""
              />
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
            <Grid item sm={6} xs={12}>
              <Controller
                render={({ field, formState }) => (
                  <FormControl fullWidth variant="outlined">
                    <Typography
                      variant="formLabel"
                      color={!!formState.errors?.application ? red[700] : ""}
                    >
                      Application
                    </Typography>
                    <TextField
                      {...field}
                      error={!!formState.errors?.application}
                      placeholder="Application"
                    />
                    {!!formState.errors?.application ? (
                      <FormHelperText error>
                        {errors?.application?.message}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                )}
                name="application"
                control={control}
                defaultValue=""
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <Controller
                render={({ field, formState }) => (
                  <FormControl fullWidth variant="outlined">
                    <Typography
                      variant="formLabel"
                      color={!!formState.errors?.description ? red[700] : ""}
                    >
                      Description
                    </Typography>
                    <TextField
                      {...field}
                      error={!!formState.errors?.description}
                      placeholder="Description"
                    />
                    {!!formState.errors?.description ? (
                      <FormHelperText error>
                        {errors?.description?.message}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                )}
                name="description"
                control={control}
                defaultValue=""
              />
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

export default ProjectCreateModal;
