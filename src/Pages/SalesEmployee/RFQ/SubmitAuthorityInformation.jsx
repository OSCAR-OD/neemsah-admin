import React, { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField, Grid, FormControl, FormLabel, FormHelperText, Box, Autocomplete, Button, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { getApiHandler, postApiHandler } from "../../../lib/axios/ApiHelper";
import ContactCreateModal from './ContactCreateModal';
import { useAuth } from "../../../Context/Auth/UseAuth";
import { toast } from "react-toastify";
import { useParams } from 'react-router-dom';


const SubmitAuthorityInformation = () => {
  const { user } = useAuth();
  const { cid, pid } = useParams();

  const { control, setValue, formState: { errors } } = useFormContext();
  const [personContacts, setPersonContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const getProjectDetails = async () => {
    try {
      const response = await getApiHandler(`/admin/sales/singleProjectByField/${pid}`);
      if (response?.success) {
        const project = response.data;
        setValue('cid', project.cid);
        setValue('companyName', project.companyName);
        setValue('pid', project.pid);
        setValue('projectName', project.projectName);
        setValue('application', project.application);
      }
    } catch {
      toast.warn('Failed to fetch project details');
    }
  };

  const getContacts = async () => {
    try {
      const response = await getApiHandler(`/admin/sales/allContactforSales/${cid}`);
      if (response?.success) {
        setPersonContacts(response.data);
      } else {
        setPersonContacts([]);
      }
    } catch {
      setPersonContacts([]);
    }
  };

  useEffect(() => {
    getProjectDetails();
    getContacts();
  }, [cid, pid]);

  const handleContactChange = (event, newValue) => {
    setSelectedContact(newValue);
    setValue('personContact', newValue?.contactPhone || '');
  };

  const filterContacts = (options, { inputValue }) => {
    const filterValue = inputValue.toLowerCase();
    return options.filter(contact =>
      contact.contactName.toLowerCase().includes(filterValue) ||
      contact.contactPhone.toLowerCase().includes(filterValue)
    );
  };

  const handleModalSave = async (newContact) => {
    try {
      const res = await postApiHandler(`/admin/crm/addContact`, {
        contactName: newContact.contactName,
        companyName: newContact.companyName,
        cid: newContact.cid,
        contactPhone: newContact.contactPhone,
        contactEmail: newContact.contactEmail,
        designation: newContact.designation,
        note: newContact.note,
        addedBy: user?.email,
      });
      if (res?.success) {
        toast.success("Contact Created");
        getContacts(); // Refresh the contacts after creating a new one
      } else {
        toast.warn('Failed to create contact', res.message);
      }
    } catch (error) {
      toast.warn('Error creating contact', error);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Authority Information
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth error={!!errors.personContact}>
          <FormLabel>Person Contact</FormLabel>
          <Controller
            name="personContact"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={personContacts}
                filterOptions={filterContacts}
                getOptionLabel={(option) => `${option.contactPhone}`}
                value={selectedContact}
                onChange={handleContactChange}
                noOptionsText={
                  <Box component="li" sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>No Contact Found</span>
                    <Button
                      onClick={() => setModalOpen(true)}
                      variant="contained"
                      color="primary"
                      sx={{ ml: 2 }}
                    >
                      + Please Create
                    </Button>
                  </Box>
                }
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    {option.contactName} - {option.contactPhone}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Type name or contact number"
                    error={!!errors.personContact}
                    variant="outlined"
                  />
                )}
              />
            )}
          />
          <FormHelperText>{errors.personContact ? errors.personContact.message : ''}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth error={!!errors.description}>
          <FormLabel>Description</FormLabel>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Description"
                error={!!errors.description}
                variant="outlined"
                multiline
                rows={4}
                fullWidth
              />
            )}
          />
          <FormHelperText>{errors.description ? errors.description.message : ''}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth error={!!errors.nextFollowUpDate}>
          <FormLabel>Next Follow-Up Date *</FormLabel>
          <Controller
            name="nextFollowUpDate"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                {...field}
                  value={field.value ? dayjs(field.value, 'MM-DD-YYYY') : null}
                  onChange={(newValue) => field.onChange(newValue ? newValue.format('MM-DD-YYYY') : '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                       variant="outlined"
                    />
                  )}
                />
              </LocalizationProvider>
            )}
          />
          <FormHelperText>{errors.nextFollowUpDate ? errors.nextFollowUpDate.message : ''}</FormHelperText>
        </FormControl>
      </Grid>
      <ContactCreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
      />
    </Grid>
  );
};

export default SubmitAuthorityInformation;
