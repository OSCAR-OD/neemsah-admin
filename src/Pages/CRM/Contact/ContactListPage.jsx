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
import PageHeader from "../../../Components/PageHeader/PageHeader";
import Modal from "../../../Components/Modal/Modal";
import MediaAllList from "../../../Components/Media/MediaAllList";
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
import {
  initialAction,
  initialEditAction,
  userActionReducer,
  userEditActionReducer,
} from "../../../utils/Action/ManageUserAction";
import DeleteAlertModal from "../../../Components/Alert/DeleteAlertModal";
import DataNotFoundTable from "../../../Components/NotFound/DataNotFoundTable";
import MediaList from "../../../Components/Modal/Crm/UploadContactModal";
import { useAuth } from "../../../Context/Auth/UseAuth";
function ContactListPage() {
  const { user } = useAuth();
  const IMG_URL = "https://api.neemsah.com";
  //const IMG_URL = "http://localhost:5500";
  //const IMG_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const [{ isLoading, isError, errorMessage, fetchData }, dispatch] =
    useReducer(fetchReducer, initialFetchData);
  const [
    { addShow, editShow, editShowId, deleteShow, deleteId },
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

  const handleShowDelete = (id) => {
    const deleteFormatId = id;
    dispatchUser({ type: "DELETE/SHOW", deleteFormatId });
  };
  const handleHideDelete = () => {
    dispatchUser({ type: "DELETE/HIDE" });
  };

  //Form submit
  const handleFormSubmit = async (data) => {
    if (data != null) {
      console.log("data", data);
      const res = await postApiHandler(
        editShow ? `/admin/crm/editContact/${editShowId}` 
        : `/admin/crm/addContact`,
        {
          contactName: data.contactName,
          companyName: data.companyName,
          cid: data.cid,
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail,
          designation: data.designation,
          note: data.note,
          addedBy: user?.email,
        }
      );

      if (res?.success) {
        uploadMediaHideModal();
        setShouldFetch((prev) => !prev);
        toast.success(editShow ? "Contact Info Updated" : "Contact Info Added");
      } else {
        if (res?.response?.status === 404) {
          toast.warn("Data not found");
        } else {
          toast.warn("Something went wrong");
        }
      }
    } else {
      toast.info("Something went wrong");
    }
  };

  //Hide Delete  functionality
  const handleDeleteAction = async () => {
    const res = await deleteApiHandler(`/admin/crm/deleteContact/${deleteId}`);
    if (res?.success) {
      handleHideDelete();
      toast.success("Contact Deleted");
      setShouldFetch((prev) => !prev);
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data Not Found");
      } else {
        toast.warn("Something went wrong");
      }
    }
  };

  //Get all media attachments
  const getMedia = async () => {
    dispatch({ type: "LOADING" });
    const res = await getApiHandler("/admin/crm/allContacts");
    //console.log("ressssss", res );
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
          <Box sx={{ maxWidth: 200 }}>{item?.contactName || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 200 }}>{item?.companyName || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 200 }}>{item?.designation || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 200 }}>{item?.contactEmail || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 200 }}>{item?.contactPhone || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 200 }}>{item?.addedBy || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell align="right">
          <Stack justifyContent={"end"}>
            <Tooltip title="Edit">
              <IconButton onClick={() => handleShowEditModal(item?.customID)}>
                <BiEdit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={() => handleShowDelete(item?.customID)}>
                <AiOutlineDelete />
              </IconButton>
            </Tooltip>
          </Stack>
        </StyledTableCell>
      </StyledTableRow>
    ));
  }

  return (
    <Box>
      <PageHeader title={"Contact List"} handleAddClick={uploadMediaShowModal} />
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          size="small"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>#SI</StyledTableCell>
              <StyledTableCell>Contact Name</StyledTableCell>
              <StyledTableCell>Company Name</StyledTableCell>
              <StyledTableCell>Designation</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Phone</StyledTableCell>
              <StyledTableCell>Added By</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{contentRender}</TableBody>
        </Table>
      </TableContainer>
      
      {/* upload/Submit Form */}
      <Modal
        isShowModal={addShow || editShow}
        title={"Contact Information"}
        handleCloseModal={uploadMediaHideModal}
        width={"1200px"}
      >
        <MediaList
          handleCancel={uploadMediaHideModal}
          handleFormSubmit={handleFormSubmit}
          isEditMood={editShow}
          editMoodId={editShowId}
        />
      </Modal>

      <DeleteAlertModal
        isOpen={deleteShow}
        modifyText={"Contact Info"}
        handleAlertClose={handleHideDelete}
        handleAlertAction={handleDeleteAction}
      /> 
    </Box>
  );
}

export default ContactListPage;
