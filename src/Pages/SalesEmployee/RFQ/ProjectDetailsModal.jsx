import {
  Box,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getApiHandler } from "../../../lib/axios/ApiHelper";
import SpinnerLoading from "../../../Components/Skeleton/Spinner/SpinnerLoading";
import { useParams } from "react-router-dom";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
};

function ProjectDetailsModal({
  isShowModal,
  handleCancel,
  fetchPath
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const { pid } = useParams();

  // Get single project data
  const getSingleProject = async () => {
    setIsLoading(true);
    //console.log("pid", pid);
    const res = await getApiHandler(`/admin/${fetchPath}/singleProjectByField/${pid}`);
    if (res?.success) {
      setProjectData(res?.data);
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data not found");
      } else {
        toast.warn("Something went wrong");
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isShowModal) {
      getSingleProject();
    }
  }, [pid]);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (!projectData) {
    return null;
  }

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Project Name</Typography>
          <Typography>{projectData.projectName}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Company Name</Typography>
          <Typography>{projectData.companyName}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Application</Typography>
          <Typography>{projectData.application}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Assigned Employee</Typography>
          <Typography>{projectData.assignedEmployee}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Initiation Date (DD-MM-YYYY)</Typography>
          <Typography>{projectData.initiationDate}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Description</Typography>
          <Typography>{projectData.description}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Created By</Typography>
          <Typography>{projectData.createdBy}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Last Edited By</Typography>
          <Typography>{projectData.lastEditedBy}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Created At (MM-DD-YYYY)</Typography>
          <Typography>{formatDate(projectData.createdAt)}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Updated At (MM-DD-YYYY)</Typography>
          <Typography>{formatDate(projectData.updatedAt)}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Custom ID</Typography>
          <Typography>{projectData.customID}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

ProjectDetailsModal.defaultProps = {
  fetchPath: "sales",
};

export default ProjectDetailsModal;
