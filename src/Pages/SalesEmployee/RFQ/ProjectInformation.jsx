import React, { useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, Grid, FormControl, FormLabel, FormHelperText, FormControlLabel, Radio, RadioGroup, Autocomplete, Box, Button } from '@mui/material';
import { getApiHandler, postApiHandler } from "../../../lib/axios/ApiHelper";
import ProjectCreateModal from './ProjectCreateModal';
import { useAuth } from "../../../Context/Auth/UseAuth";
import { toast } from "react-toastify";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const radioOptions = [
  { label: 'Quotation Required', value: 'Quotation' },
  { label: 'Revised Quotation Required', value: 'revisedQuotationRequired' },
  { label: 'PI Required', value: 'piRequired' },
  { label: 'Revised PI Required', value: 'revisedPiRequired' },
  { label: 'LC Open', value: 'lcOpen' },
  { label: 'None', value: 'none' },
];

const ProjectInformation = ({ setFlagValue }) => {
  const { user } = useAuth();
  const { control, setValue, formState: { errors } } = useFormContext();
  const [projectNameOptions, setProjectNameOptions] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filteredApplicationOptions, setFilteredApplicationOptions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const getProjectName = async () => {
    const res = await getApiHandler(`/admin/crm/allProjects`);
    if (res?.success) {
      setProjectNameOptions(res.data);
    }
  };

  const handleprojectNameChange = (event, newValue) => {
    setSelectedProjectName(newValue);
    setValue('projectName', newValue.projectName);
    setValue('pid', newValue.pid);
    if (newValue) {
      const applicationOptions = projectNameOptions.filter(option => option.projectName === newValue.projectName);
      setFilteredApplicationOptions(applicationOptions);
    } else {
      setFilteredApplicationOptions([]);
    }
  };

  const handleApplicationChange = (event, newValue) => {
    setSelectedApplication(newValue);
    setValue('application', newValue?.application);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleModalSave = async (newProject) => {
    try {
      const initiationDate = formatDate(new Date());
      console.log("initiationDate", initiationDate);
      const res = await postApiHandler(`/admin/crm/addProject`, {
        projectName: newProject?.projectName,
        pid: newProject?.pid,
        companyName: newProject?.companyName,
        application: newProject?.application,
        initiationDate: initiationDate,
        description: newProject?.description,
        createdBy: user?.email,
        assignedEmployee: user?.email,
      });
      if (res?.success) {
        toast.success("Project Created");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.warn('Failed to create project', res.message);
      }
    } catch (error) {
      toast.warn('Error creating project', error);
    }
  };

  useEffect(() => {
    getProjectName();
  }, []);

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid item xs={12}>
        <FormControl fullWidth error={!!errors.projectName}>
          <FormLabel>Project Name</FormLabel>
          <Controller
            name="projectName"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={projectNameOptions}
                getOptionLabel={(option) => option.projectName}
                value={selectedProjectName}
                onChange={handleprojectNameChange}
                noOptionsText={
                  <Box component="li" sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>No Project Found</span>
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
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select a Project"
                    error={!!errors.projectName}
                    variant="outlined"
                  />
                )}
              />
            )}
          />
          <FormHelperText>{errors.projectName ? errors.projectName.message : ''}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth error={!!errors.application}>
          <FormLabel>Application</FormLabel>
          <Controller
            name="application"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={filteredApplicationOptions}
                getOptionLabel={(option) => option.application}
                value={selectedApplication}
                onChange={handleApplicationChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select an Application"
                    error={!!errors.application}
                    variant="outlined"
                  />
                )}
              />
            )}
          />
          <FormHelperText>{errors.application ? errors.application.message : ''}</FormHelperText>
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
      <ProjectCreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
      />
    </Grid>
  );
};

export default ProjectInformation;
