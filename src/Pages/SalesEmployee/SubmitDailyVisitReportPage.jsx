import React, { useState, useEffect } from 'react';
import { Paper, Box, Typography, Button } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import SubmitAuthorityInformation from './RFQ/SubmitAuthorityInformation';
import SubmitProjectInformation from './RFQ/SubmitProjectInformation';
import RFQInformation from './RFQ/RFQInformation';
import FinanceInformation from './RFQ/FinanceInformation';
import { useParams } from 'react-router-dom';
import { getApiHandler, postApiHandler } from "../../lib/axios/ApiHelper";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../Context/Auth/UseAuth";
const steps = ['Authority Information', 'RFQ Information', 'Finance Information'];
const validationSchemas = [
  Yup.object().shape({
    companyName: Yup.mixed().required('Company Name is required'),
    personContact: Yup.mixed().required('Person Contact is required'),
    description: Yup.mixed().required('Description is required'),
    nextFollowUpDate: Yup.string().required('Next Follow Up Date is required'),
    projectName: Yup.string().required('Project Name is required'),
    application: Yup.string().required('Application Name is required'),
    flags: Yup.string().required('Flag Value is required'),
  }),
  Yup.object().shape({
    rfqType: Yup.string().required('rfqType is required'),
    deadline: Yup.string().required('Deadline must be at least 7 days in the future'),
    //deadline: Yup.string().min(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
  }),
  Yup.object().shape({
    visitType: Yup.string().required('Visit Type is required'),
    visitPlace: Yup.string().required('Visit Place is required'),
    // travelCost: Yup.number().required('Travel Cost is required'),
    // foodCost: Yup.number().required('Food Cost is required'),
    // accommodationCost: Yup.number().required('Accommodation Cost is required'),
    // otherCost: Yup.number().required('Other Cost is required'),
    // extraCostReason: Yup.string().required('Reason for Extra Cost is required'),
  }),
];

const SubmitDailyVisitReportPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(() => {
    const storedData = JSON.parse(localStorage.getItem('formData'));
    if (storedData && new Date().getTime() < storedData.expiry) {
      return storedData.data;
    }
    return {};
  });
  const [loading, setLoading] = useState(false);
  const [flagValue, setFlagValue] = useState(null);

  const methods = useForm({
    resolver: yupResolver(validationSchemas[activeStep]),
    mode: 'onChange',
    defaultValues: formData,
  });

  const { handleSubmit, setValue, reset, getValues, formState: { errors } } = methods;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const initialResponse = await getApiHandler(`/admin/crm/singleRfqType/${id}`);
        const data = initialResponse?.data?.rfqType;

        if (data) {
          setFormData(data);
          reset(data);
        } else {
          const storedData = JSON.parse(localStorage.getItem('formData'));
          if (storedData && new Date().getTime() < storedData.expiry) {
            setFormData(storedData.data);
            reset(storedData.data);
          }
          else {
            localStorage.removeItem('formData');
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching data', error);
      } 
      finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, reset]);

  useEffect(() => {
    reset(formData);
  }, [activeStep, reset, formData]);

  const handleNext = (data) => {
    const createdBy = user.email;
    const updatedFormData = { ...formData, ...data, createdBy };
    const expiryTime = new Date().getTime() + 4 * 60 * 1000;
    localStorage.setItem('formData', JSON.stringify({ data: updatedFormData, expiry: expiryTime }));
    setFormData(updatedFormData);

    if (activeStep === steps.length - 1) {
      const storedData = JSON.parse(localStorage.getItem('formData')).data;
      postApiHandler('/admin/sales/createDailyReport', storedData)
        .then(response => {
          if (response?.success) {
            toast.success("Form submission completed!");
            localStorage.removeItem('formData');
            navigate("/");
          } else {
            toast.error("Error saving data");
          }
        })
        .catch(error => {
          console.error('Error saving data', error);
          toast.error("Error saving data");
        });
    } else {
      if (activeStep === 0 && flagValue === 'none') {
        setActiveStep(2);
      } else {
        setActiveStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
         return (
           <div>
             <SubmitAuthorityInformation control={methods.control} errors={methods.formState.errors} />
             <SubmitProjectInformation control={methods.control} errors={methods.formState.errors} setFlagValue={setFlagValue} />
           </div>
         );
       case 1:
         return <RFQInformation control={methods.control} errors={methods.formState.errors} flagValue={flagValue} />;
      case 2:
        return <FinanceInformation control={methods.control} errors={methods.formState.errors}/>;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <Paper sx={{ maxWidth: 1150, width: 1, mx: 'auto', py: { sm: 3, xs: 2 }, px: { sm: 3, xs: 1 } }}>
        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(handleNext)}>
            {renderStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                  Back
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 3, ml: 1 }}
              >
                {activeStep === steps.length - 1 ? 'Save & Finish' : 'Save & Next'}
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </FormProvider>
  );
};

export default SubmitDailyVisitReportPage;
