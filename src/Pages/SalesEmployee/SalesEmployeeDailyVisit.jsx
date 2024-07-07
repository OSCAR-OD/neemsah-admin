import React, { useEffect, useReducer, useState } from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { fetchReducer, getApiHandler, initialFetchData } from "../../lib/axios/ApiHelper";
import { initialAction, userActionReducer } from "../../utils/Action/ManageUserAction";
import { BsArrowRight } from "react-icons/bs";
import { useAuth } from "../../Context/Auth/UseAuth";

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function SalesEmployeeDailyVisit() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [{ isLoading, isError, errorMessage }, dispatch] = useReducer(fetchReducer, initialFetchData);
  const [{ addShow, editShow, editShowId, deleteShow, deleteId }, dispatchUser] = useReducer(userActionReducer, initialAction);
  const [visitData, setVisitData] = useState([]);

  const handleCardClick = (page) => {
    navigate(page);
  };

  const getMedia = async () => {
    dispatch({ type: "LOADING" });
    const res = await getApiHandler(`/admin/sales/allProjectsByField/${user?.email}`);
   
    if (res?.success) {
      //console.log("API Response Success Data:", res.data);
      const dataFormat = res.data.map(project => ({
        pid: project.pid,
        projectName: project.projectName,
        cid: project.cid,
        companyName: project.companyName,
        application: project.application,
        initiationDate: project.initiationDate,

        customID: project.customID,
        backgroundColor: getRandomColor(),
      }));
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
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
        <Typography variant="h4" gutterBottom>
          Last Visits
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleCardClick(`create-report`)}>
          Create Report
        </Button>
      </Box>
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : isError ? (
        <Typography>{errorMessage}</Typography>
      ) : (
        visitData.map((visit, index) => (
          <Card
            key={index}
            sx={{
              backgroundColor: visit.backgroundColor,
              marginBottom: 2,
              color: 'white',
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography variant="h6">
                Company Name: {visit.companyName}
              </Typography>
              <Typography>
                Project Name: {visit.projectName}
              </Typography>
              <Typography>
                Initiation Date: {visit.initiationDate}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  marginTop: 1,
                  cursor: 'pointer',
                }}
                onClick={() => handleCardClick(`submit/${visit.cid}/${visit.pid}`)}
              >
                <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                  See Details
                  <BsArrowRight size={30} style={{ marginLeft: 8 }} />
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}

export default SalesEmployeeDailyVisit;

