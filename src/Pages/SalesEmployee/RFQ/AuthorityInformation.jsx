import React, { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField, Grid, FormControl, FormLabel, FormHelperText, Box, Autocomplete, Button, Typography } from '@mui/material';
import { getApiHandler, postApiHandler } from "../../../lib/axios/ApiHelper";
import ContactCreateModal from './ContactCreateModal';
import { useAuth } from "../../../Context/Auth/UseAuth";
import { toast } from "react-toastify";

const AuthorityInformation = () => {
  const { user } = useAuth();
  const { control, setValue, formState: { errors } } = useFormContext();
  const [companyOptions, setCompanyOptions] = useState([]);
  const [personContacts, setPersonContacts] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const getContacts = async (cid) => {
    return await getApiHandler(`/admin/sales/allContactforSales/${cid}`);
  };

  const getCompany = async () => {
    const res = await getApiHandler("/admin/crm/allCustomers");
    if (res?.success) {
      setCompanyOptions(res.data);
    }
  };

  useEffect(() => {
    getCompany();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      getContacts(selectedCompany.cid)
        .then(response => {
          if (response?.data) {
            setPersonContacts(response.data);
          } else {
            setPersonContacts([]);
          }
        })
        .catch(() => {
          setPersonContacts([]);
        });
    } else {
      setPersonContacts([]);
    }
  }, [selectedCompany]);

  const handleCompanyChange = (event, newValue) => {
    setSelectedCompany(newValue);
    setSelectedContact(null);
    setValue('companyName', newValue.companyName);
    setValue('cid', newValue.cid);
  };

  const handleContactChange = (event, newValue) => {
    setSelectedContact(newValue);
    setValue('personContact', newValue.contactPhone);
  };

  const filterContacts = (options, { inputValue }) => {
    const filterValue = inputValue.toLowerCase();
    return options.filter(contact =>
      contact.contactName.toLowerCase().includes(filterValue) ||
      contact.companyName.toLowerCase().includes(filterValue) ||
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
        <FormControl fullWidth error={!!errors.companyName}>
          <FormLabel>Company Name</FormLabel>
          <Controller
            name="companyName"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={companyOptions}
                getOptionLabel={(option) => option.companyName}
                value={selectedCompany}
                onChange={handleCompanyChange}
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
                    {option.contactName} - {option.companyName} - {option.contactPhone}
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
      <ContactCreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
      />
    </Grid>
  );
};

export default AuthorityInformation;
