import React, { useEffect, useReducer, useState } from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { fetchReducer, getApiHandler, initialFetchData } from "../../lib/axios/ApiHelper";
import { initialAction, userActionReducer } from "../../utils/Action/ManageUserAction";
import { useAuth } from "../../Context/Auth/UseAuth";
import SubmitDailyVisitReportPage from "./SubmitDailyVisitReportPage";
import ProjectDetailsModal from "./RFQ/ProjectDetailsModal";
import LastVisitSummaryModal from "./RFQ/LastVisitSummaryModal";
import TodayVisitSummaryModal from "./RFQ/TodayVisitSummaryModal";
import Modal from "../../Components/Modal/Modal";

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function ViewDailyVisitReportPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pid } = useParams();
  const [{ isLoading, isError, errorMessage }, dispatch] = useReducer(fetchReducer, initialFetchData);
  const [{ addShow, editShow, editShowId, deleteShow, deleteId }, dispatchUser] = useReducer(userActionReducer, initialAction);
  const [visitData, setVisitData] = useState(null);
  const [projectDetailsModalOpen, setProjectDetailsModalOpen] = useState(false);
  const [lastVisitSummaryModalOpen, setLastVisitSummaryModalOpen] = useState(false);
  const [todayVisitSummaryModalOpen, setTodayVisitSummaryModalOpen] = useState(false);

  const handleProjectDetailsModalOpen = () => {
    setProjectDetailsModalOpen(true);
  };

  const handleProjectDetailsModalClose = () => {
    setProjectDetailsModalOpen(false);
  };

  const handleLastVisitSummaryModalOpen = () => {
    setLastVisitSummaryModalOpen(true);
  };

  const handleLastVisitSummaryModalClose = () => {
    setLastVisitSummaryModalOpen(false);
  };

  const handleTodayVisitSummaryModalOpen = () => {
    setTodayVisitSummaryModalOpen(true);
  };

  const handleTodayVisitSummaryModalClose = () => {
    setTodayVisitSummaryModalOpen(false);
  };

  const getMedia = async () => {
    dispatch({ type: "LOADING" });
    const res = await getApiHandler(`/admin/sales/singleProjectByField/${pid}`);

    if (res?.success) {
      const project = res.data;
      const dataFormat = {
        pid: project.pid,
        companyName: project.companyName,
        cid: project.cid,
        projectName: project.projectName,
        application: project.application,
        initiationDate: project.initiationDate,
        backgroundColor: getRandomColor(),
      };
      setVisitData(dataFormat);
      dispatch({ type: "LOADED" });
    } else {
      if (res?.response?.status === 404) {
        dispatch({ type: "ERROR", errorMessage: "Data not found" });
      } else {
        dispatch({ type: "ERROR", errorMessage: "Something went wrong" });
      }
    }
  };

  useEffect(() => {
    getMedia();
  }, [pid]);

  return (
    <>
      <Box sx={{ padding: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
          <Typography variant="h4" gutterBottom>
            Submit Daily Visit Report
          </Typography>
        </Box>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : isError ? (
          <Typography>{errorMessage}</Typography>
        ) : (
          visitData && (
            <>
              <Card
                sx={{
                  backgroundColor: visitData.backgroundColor,
                  marginBottom: 2,
                  color: 'white',
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Typography variant="h6">
                    Company Name: {visitData.companyName}
                  </Typography>
                  <Typography>
                    Project Name: {visitData.projectName}
                  </Typography>
                  <Typography>
                    Application: {visitData.application}
                  </Typography>
                  <Typography>
                    Initiation Date: {visitData.initiationDate}
                  </Typography>
                  <Typography variant="h6">
                    PID: {visitData.pid}
                  </Typography>
                </CardContent>
              </Card>
              <Card
                sx={{
                  backgroundColor: '#F2F2F2',
                  marginBottom: 2,
                  color: '#000000',
                  borderRadius: 3,
                }}
                onClick={handleProjectDetailsModalOpen}
              >
                <CardContent>
                  <Typography variant="h6" sx={{textDecoration: 'underline'}}>
                    Project Details
                  </Typography>
                </CardContent>
              </Card>
              <Card
                sx={{
                  backgroundColor: '#F2F2F2',
                  marginBottom: 2,
                  color: '#000000',
                  borderRadius: 3,
                }}
                onClick={handleLastVisitSummaryModalOpen}
              >
                <CardContent>
                  <Typography variant="h6" sx={{textDecoration: 'underline'}}>
                    Last Visit Summary
                  </Typography>
                </CardContent>
              </Card>
              {/* <Card
                sx={{
                  backgroundColor: '#F2F2F2',
                  marginBottom: 2,
                  color: '#000000',
                  borderRadius: 3,
                }}
                onClick={handleTodayVisitSummaryModalOpen}
              >
                <CardContent>
                  <Typography variant="h6" sx={{textDecoration: 'underline'}}>
                    Today’s Visit Summary
                  </Typography>
                </CardContent>
              </Card> */}
              <Modal
               isShowModal={projectDetailsModalOpen}
               title={"Project Details"}
               handleCloseModal={handleProjectDetailsModalClose}
               width={"1200px"}     
               >
              <ProjectDetailsModal 
              isShowModal={projectDetailsModalOpen}
              open={projectDetailsModalOpen} 
              handleClose={handleProjectDetailsModalClose} />
              </Modal>
              <Modal
               isShowModal={lastVisitSummaryModalOpen}
               title={"Last Visit Summary Details"}
               handleCloseModal={handleLastVisitSummaryModalClose}
               width={"1200px"}     
               >
                <LastVisitSummaryModal 
                isShowModal={lastVisitSummaryModalOpen}
                open={lastVisitSummaryModalOpen} 
                handleClose={handleLastVisitSummaryModalClose} 
                />
              </Modal>
              
              <TodayVisitSummaryModal open={todayVisitSummaryModalOpen} handleClose={handleTodayVisitSummaryModalClose} />
              <SubmitDailyVisitReportPage />
            </>
          )
        )}
      </Box>
    </>
  );
}

export default ViewDailyVisitReportPage;
