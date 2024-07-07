import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Modal } from "@mui/material";
import { getApiHandler } from "../../../lib/axios/ApiHelper";
import { useParams } from 'react-router-dom';
import SpinnerLoading from "../../../Components/Skeleton/Spinner/SpinnerLoading";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
};

const LastVisitSummaryModal = ({   
  isShowModal,
  handleCancel,
  fetchPath }) => {
  const { pid } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [visitSummary, setVisitSummary] = useState(null);
  const [isError, setIsError] = useState(false);

  const fetchVisitSummary = async () => {
    setIsLoading(true);
    setIsError(false);
    const res = await getApiHandler(`/admin/sales/lastVisitSummaryByField/${pid}`);
    if (res?.success) {
      setVisitSummary(res.data);
    } else {
      setIsError(true);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (open) {
      fetchVisitSummary();
    }
  }, [pid]);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (isError) {
    return (
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Typography>Error fetching data</Typography>
        </Box>
      </Modal>
    );
  }

  if (!visitSummary) {
    return null;
  }

  return (
      <Box >
  {visitSummary.map((summary, index) => (
          <Box key={index} mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Last Visit Summary (Created At {formatDate(summary.createdAt)})</Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Project Name</Typography>
                <Typography>{summary.projectName}</Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Company Name</Typography>
                <Typography>{summary.companyName}</Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Person Contact</Typography>
                <Typography>{summary.personContact}</Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Application</Typography>
                <Typography>{summary.application}</Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Description</Typography>
                <Typography>{summary.description}</Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Next Follow Up Date</Typography>
                <Typography>{summary.nextFollowUpDate}</Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Deadline</Typography>
                <Typography>{summary.deadline}</Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>RFQ Type</Typography>
                <Typography>{summary.rfqType}</Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Created By</Typography>
                <Typography>{summary.createdBy}</Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Created At (MM-DD-YYYY)</Typography>
                <Typography>{formatDate(summary.createdAt)}</Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Updated At (MM-DD-YYYY)</Typography>
                <Typography>{formatDate(summary.updatedAt)}</Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Custom ID</Typography>
                <Typography>{summary.customID}</Typography>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>
  );
};

export default LastVisitSummaryModal;
