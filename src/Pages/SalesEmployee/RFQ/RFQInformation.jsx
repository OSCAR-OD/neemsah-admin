import React, { useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, Grid, Button, Typography, FormControl, FormLabel, FormHelperText, Autocomplete, IconButton, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { IoCloseSharp } from "react-icons/io5";
import { getApiHandler } from "../../../lib/axios/ApiHelper";
import Preview from "../../CRM/RFQ/RSVP/Preview";

const RFQInformation = ({ flagValue }) => {
  //console.log("flagValue", flagValue);
  const { control, setValue, formState: { errors } } = useFormContext();
  const today = dayjs();
  const minDate = today.add(7, 'day');
  const [rfqTypeOptions, setRfqTypeOptions] = useState([]);
  const [selectedRfqType, setSelectedRfqType] = useState(null);
  const [rsvpData, setRsvpData] = useState(null);
  const [machineData, setMachineData] = useState(() => JSON.parse(localStorage.getItem('machineInformation')) || []);

  useEffect(() => {
    const getRFQType = async () => {
      //if (flagValue) {
        const res = await getApiHandler(`/admin/crm/allByFieldRfqType/Quotation`);
        if (res?.success) {
          setRfqTypeOptions(res.data);
        }
      //}
    };
    getRFQType();
  }, [flagValue]);

  useEffect(() => {
    if (selectedRfqType) {
      const getSingleRSVP = async () => {
        const res = await getApiHandler(`/admin/crm/singleRSVP/${selectedRfqType.customID}`);
        if (res?.success) {
          setRsvpData(res.data);
          setValue('rsvpData', res.data);
        }
      };
      getSingleRSVP();
    }
  }, [selectedRfqType]);

  const handleAddMachine = () => {
    const newMachineData = [...machineData, { title: `Machine ${machineData.length + 1} Information`, speed: '', fillingVolume: '', fillingAccuracy: '', foilSpecification: '', packetType: '', remarks: '' }];
    setMachineData(newMachineData);
    //setMachineInformation(newMachineData);
    setValue('machineInformation', newMachineData);
  };

  const handleMachineChange = (index, field, value) => {
    const updatedMachineData = machineData.map((machine, i) => (i === index ? { ...machine, [field]: value } : machine));
    setMachineData(updatedMachineData);
    //setMachineInformation(updatedMachineData);
    setValue('machineInformation', updatedMachineData);
  };

  const handleDeleteMachine = (index) => {
    const updatedMachineData = machineData.filter((_, i) => i !== index);
    setMachineData(updatedMachineData);
    //setMachineInformation(updatedMachineData);
    setValue('machineInformation', updatedMachineData);
  };

  const handleRfqTypeChange = (event, newValue) => {
    setSelectedRfqType(newValue);
    setValue('rfqType', newValue.rfqType);
  };

  const handleQuestionValueChange = (e, sectionIndex, questionIndex) => {
    const updatedRsvpData = { ...rsvpData };
    updatedRsvpData.sections[sectionIndex].questions[questionIndex].value = e.target.value;
    setRsvpData(updatedRsvpData);
    setValue('rsvpData', updatedRsvpData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          RFQ Information
        </Typography>
      </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.rfqType}>
            <FormLabel>Type</FormLabel>
            <Controller
              name="rfqType"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={rfqTypeOptions}
                  getOptionLabel={(option) => option.rfqType}
                  value={selectedRfqType}
                  onChange={handleRfqTypeChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select RFQ Type"
                      error={!!errors.rfqType}
                      variant="outlined"
                    />
                  )}
                />
              )}
            />
            <FormHelperText>{errors.rfqType ? errors.rfqType.message : ''}</FormHelperText>
          </FormControl>
        </Grid>
        {rsvpData && rsvpData.sections.map((section, sectionIndex) => (
          <Grid item xs={12} key={sectionIndex}>
            <Typography variant="h6">{section.title}</Typography>
            {section.questions.map((question, questionIndex) => (
              <Preview
                key={questionIndex}
                sectionIndex={sectionIndex}
                questionIndex={questionIndex}
                question={question}
                handleQuestionValueChange={handleQuestionValueChange}
              />
            ))}
          </Grid>
        ))}
        {machineData.map((machine, index) => (
          <Grid item xs={12} key={index}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{machine.title}</Typography>
              <IconButton onClick={() => handleDeleteMachine(index)}>
                <IoCloseSharp />
              </IconButton>
            </Box>
            <TextField
              label="Speed"
              value={machine.speed}
              onChange={(e) => handleMachineChange(index, 'speed', e.target.value)}
              placeholder="Type Speed Here"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Filling Volume"
              value={machine.fillingVolume}
              onChange={(e) => handleMachineChange(index, 'fillingVolume', e.target.value)}
              placeholder="Type Volume Here"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Filling Accuracy"
              value={machine.fillingAccuracy}
              onChange={(e) => handleMachineChange(index, 'fillingAccuracy', e.target.value)}
              placeholder="Type Filling Accuracy Here"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Foil Specification"
              value={machine.foilSpecification}
              onChange={(e) => handleMachineChange(index, 'foilSpecification', e.target.value)}
              placeholder="Type Foil Specification Here"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Packet Type"
              value={machine.packetType}
              onChange={(e) => handleMachineChange(index, 'packetType', e.target.value)}
              placeholder="Type Packet Type Here"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Remarks"
              value={machine.remarks}
              onChange={(e) => handleMachineChange(index, 'remarks', e.target.value)}
              placeholder="Type Remarks Here"
              fullWidth
              margin="normal"
            />
          </Grid>
        ))}
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleAddMachine}>
            Add Machine Details
          </Button>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.deadline}>
            <FormLabel>Deadline * (Minimum 7 days) (MM-DD-YYYY)</FormLabel>
            <Controller
              name="deadline"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={field.value ? dayjs(field.value) : null}
                  minDate={minDate}
                  onChange={(newValue) => field.onChange(newValue.format('MM-DD-YYYY'))}
                  renderInput={(params) => <TextField {...params} variant="outlined" />}
                />
              )}
            />
            <FormHelperText>{errors.deadline ? errors.deadline.message : 'Deadline must be at least 7 days in the future'}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default RFQInformation;
