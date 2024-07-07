import React, { useEffect, useReducer, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import {
  fetchReducer,
  getApiHandler,
  initialFetchData,
  postApiHandler,
  deleteApiHandler,
} from "../../lib/axios/ApiHelper";
import { toast } from "react-toastify";
import {
  initialAction,
  userActionReducer,
} from "../../utils/Action/ManageUserAction";
import { CiLocationOn } from "react-icons/ci";
import dailyVst from "/assets/icons/sales/dailyVst.svg";
import fin from "/assets/icons/sales/fin.svg";
import tsk from "/assets/icons/sales/tsk.svg";
function SalesDashboard() {
  const navigate = useNavigate();
  const [{ isLoading, isError, errorMessage, fetchData }, dispatch] =
    useReducer(fetchReducer, initialFetchData);
  const [
    { addShow, editShow, editShowId, deleteShow, deleteId },
    dispatchUser,
  ] = useReducer(userActionReducer, initialAction);
  const [shouldFetch, setShouldFetch] = useState(false);

  const handleCardClick = (page) => {
    navigate(page);
  };

  const getMedia = async () => {
    dispatch({ type: "LOADING" });
    const res = await getApiHandler("/admin/crm/allRfqType");
    if (res?.success) {
      const dataFormat = res.data;
      dispatch({ type: "LOADED", dataFormat });
    } else {
      if (res?.response?.status === 404) {
        const errorFormat = "Data not found";
        dispatch({ type: "ERROR", errorFormat });
      } else {
        const errorFormat = "Something went wrong";
        dispatch({ type: "ERROR", errorFormat });
      }
    }
  };

  useEffect(() => {
    getMedia();
  }, [shouldFetch]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Card
        sx={{ width: 150, cursor: 'pointer' }}
        onClick={() => handleCardClick('/salesDashboard/daily-visit')}
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            padding: '24px !important',

          }}
        >
          <Box
            component={"img"}
            src={dailyVst}
            alt="Daily Visit"
            sx={{ width: 40 }}
          />
          <Typography variant="h6" component="div">
            Daily Visit
          </Typography>
          <Typography variant="h5" component="div">
            40
          </Typography>
        </CardContent>
      </Card>

      <Card
        sx={{ width: 150, cursor: 'pointer', marginLeft: '20px' }}
        onClick={() => handleCardClick('/salesDashboard/finance')}
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            padding: '24px !important',
          }}
        >
          <Box
            component={"img"}
            src={fin}
            alt="Finance"
            sx={{ width: 40 }}
          />
          <Typography variant="h6" component="div">
            Finance
          </Typography>
          <Typography variant="h5" component="div">
            30
          </Typography>
        </CardContent>
      </Card>

      <Card
        sx={{ width: 150, cursor: 'pointer', marginLeft: '20px' }}
        onClick={() => handleCardClick('/salesDashboard/tasks')}
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            padding: '24px !important',
          }}
        >
          <Box
            component={"img"}
            src={tsk}
            alt="Tasks"
            sx={{ width: 40 }}
          />
          <Typography variant="h6" component="div">
            Tasks
          </Typography>
          <Typography variant="h5" component="div">
            30
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SalesDashboard;
