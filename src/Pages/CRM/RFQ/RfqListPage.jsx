import {
  Avatar,
  Box,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useReducer, useState } from "react";
import PageHeader from "../../../Components/PageHeader/PageHeaderButtonLess";
import Modal from "../../../Components/Modal/Modal";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../Components/CustomStyle/table/TableStyle";
import { AiOutlineDelete, AiOutlinePlayCircle } from "react-icons/ai";
import TableSkeleton from "../../../Components/Skeleton/Table/TableSkeleton";
import {
  deleteApiHandler,
  fetchReducer,
  getApiHandler,
  initialFetchData,
  postApiHandler,
} from "../../../lib/axios/ApiHelper";
import { toast } from "react-toastify";
import ErrorMessage from "../../../Components/Error/ErrorMessage";
import DataNotFound from "../../../Components/NotFound/DataNotFound";
import { BiEdit } from "react-icons/bi";
import { RiEyeLine } from "react-icons/ri";
import {
  initialAction,
  initialEditAction,
  userActionReducer,
  userEditActionReducer,
} from "../../../utils/Action/ManageUserAction";
import DeleteAlertModal from "../../../Components/Alert/DeleteAlertModal";
import DataNotFoundTable from "../../../Components/NotFound/DataNotFoundTable";
import MediaList from "../../../Components/Modal/Crm/UploadRfqModal";
import MediaViewList from "../../../Components/Modal/Crm/ViewRfqModal";
import { useAuth } from "../../../Context/Auth/UseAuth";
function RfqListPage() {
  const { user } = useAuth();
  //const IMG_URL = "https://api.neemsah.com";
  const IMG_URL = "http://localhost:5500";
  //const IMG_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const [{ isLoading, isError, errorMessage, fetchData }, dispatch] =
    useReducer(fetchReducer, initialFetchData);
  const [
    { addShow, editShow, editShowId, viewShow, viewShowId, deleteShow, deleteId },
    dispatchUser,
  ] = useReducer(userActionReducer, initialAction);
  const [shouldFetch, setShouldFetch] = useState(false);

  //?Upload Media Modal
  //Show Upload modal
  const uploadMediaShowModal = () => {
    dispatchUser({ type: "ADD/SHOW" });
    // dispatchUser({ type: "EDIT/HIDE" });
  };
  //Hide Upload modal
  const uploadMediaHideModal = () => {
    dispatchUser({ type: "ADD/EDIT/HIDE" });
    // dispatchUser({ type: "EDIT/HIDE" });
  };

  //Show modal
  const handleShowEditModal = (id) => {
    const editFormatId = id;
    // dispatchUser({ type: "EDIT/SHOW" });
    dispatchUser({ type: "EDIT/SHOW", editFormatId });
  };

  const handleShowView = (id) => {
    const viewFormatId = id;
    dispatchUser({ type: "VIEW/SHOW", viewFormatId });
  };
  const handleHideView = () => {
    dispatchUser({ type: "VIEW/HIDE" });
  };

  //Form submit
  const handleFormSubmit = async (data, uploadedFile) => {
    //console.log("uploadedFile", uploadedFile);
    if (data) {
      const formData = new FormData();
      //console.log("data", data);
      formData.append("claimedBy", data?.claimedBy);
      formData.append("status", data?.status);
      formData.append("comments", data?.comments);
      formData.append("files", uploadedFile[0]?.file);
      const res = await postApiHandler(
        editShow ? `/admin/crm/sales/editSingleRFQ/${editShowId}`
        :  `/admin/sales/editSingleRFQ/${viewShowId}`, 
        formData
      );

      if (res?.success) {
        uploadMediaHideModal();
        setShouldFetch((prev) => !prev);
        toast.success(editShow ? "RFQ Info Updated" : viewShow ? "RFQ Info Updated": "RFQ Info Added");
      } else {
        if (res?.response?.status === 404) {
          toast.warn("Data not found");
        } else {
          toast.warn("Something went wrong");
        }
      }
    } else {
      toast.info("Please select a attachment");
    }
  };

  //Get all media attachments
  const getMedia = async () => {
    dispatch({ type: "LOADING" });
    const res = await getApiHandler("/admin/sales/allRfqList");
    // console.log("ressssss", res.data );
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

  //Condition Render
  let contentRender;

  if (isLoading) {
    contentRender = (
      <TableSkeleton numberOfTitle={2} isShowDescription={false} />
    );
  } else if (isError) {
    return <ErrorMessage message={errorMessage} />;
  } else if (fetchData?.length <= 0) {
    contentRender = <DataNotFoundTable column={5} />;
  } else if (fetchData?.length > 0) {
    contentRender = fetchData?.map((item, index) => (
      <StyledTableRow key={item?._id}>
        <StyledTableCell component="th" scope="row">
          {index + 1}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 200 }}>{item?.companyName || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 200 }}>{item?.projectName || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 200 }}>{item?.application || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 200 }}>{item?.createdAt || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ minWidth: 90 }}>{item?.createdBy || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 200 }}>{item?.deadline || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 200 }}>{item?.status || "Open"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ minWidth: 100 }}>{item?.claimedBy || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell align="right">
          <Stack justifyContent={"end"}>
          <Tooltip title="View">
              <IconButton onClick={() => handleShowView(item?.customID)}>
                <RiEyeLine />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton onClick={() => handleShowEditModal(item?.customID)}>
                <BiEdit />
              </IconButton>
            </Tooltip>
            
          </Stack>
        </StyledTableCell>
      </StyledTableRow>
    ));
  }

  return (
    <Box>
    <PageHeader title={"RFQ List"}  />
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          size="small"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>#SI</StyledTableCell>
              <StyledTableCell>Customer</StyledTableCell>
              <StyledTableCell>Project</StyledTableCell>
              <StyledTableCell>Application</StyledTableCell>
              <StyledTableCell>Creation Date</StyledTableCell>
              <StyledTableCell>Created By</StyledTableCell>
              <StyledTableCell>Deadline</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Assigned To</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{contentRender}</TableBody>
        </Table>
      </TableContainer>
      {/* View RFQ */}
      <Modal
        isShowModal={viewShow || editShow}
        title={"RFQ Information"}
        handleCloseModal={uploadMediaHideModal}
        width={"1200px"}
      >
        <MediaViewList
          handleCancel={uploadMediaHideModal}
          handleFormSubmit={handleFormSubmit}
          isViewModal={viewShow || editShow}
          id={viewShowId || editShowId}
        />
      </Modal>
    </Box>
  );
}

export default RfqListPage;
