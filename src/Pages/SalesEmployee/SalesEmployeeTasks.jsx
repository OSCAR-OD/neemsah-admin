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

function SalesEmployeeTasks() {
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
    </Box>
  );
}

export default SalesEmployeeTasks;
