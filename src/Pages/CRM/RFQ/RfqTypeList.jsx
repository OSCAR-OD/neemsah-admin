import React, { useEffect, useReducer, useState } from "react";
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
import PageHeader from "../../../Components/PageHeader/PageHeader";
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
import { MdRsvp } from "react-icons/md";
import {
  initialAction,
  userActionReducer,
} from "../../../utils/Action/ManageUserAction";
import DeleteAlertModal from "../../../Components/Alert/DeleteAlertModal";
import DataNotFoundTable from "../../../Components/NotFound/DataNotFoundTable";
import UploadRfqModal from "../../../Components/Modal/Crm/UploadRfqModal"; // Adjust import if necessary
import { useNavigate } from 'react-router-dom';
import MediaList from "../../../Components/Modal/Crm/Rfq/EditRfqTypeModal";
import { useAuth } from "../../../Context/Auth/UseAuth";

function RfqTypeList() {
  const { user } = useAuth()
  const navigate = useNavigate();
  const IMG_URL = "https://api.neemsah.com";
  const [{ isLoading, isError, errorMessage, fetchData }, dispatch] =
    useReducer(fetchReducer, initialFetchData);
  const [
    { addShow, editShow, editShowId, viewShow, viewShowId, deleteShow, deleteId },
    dispatchUser,
  ] = useReducer(userActionReducer, initialAction);
  const [shouldFetch, setShouldFetch] = useState(false);

  // Show Upload modal
  const uploadMediaShowModal = () => {
    dispatchUser({ type: "ADD/SHOW" });
  };

  // Hide Upload modal
  const uploadMediaHideModal = () => {
    dispatchUser({ type: "ADD/EDIT/HIDE" });
  };

  const handleShowEditModal = (id) => {
    const editFormatId = id;
    dispatchUser({ type: "EDIT/SHOW", editFormatId });
  };

  // const handleShowViewModal = (id) => {
  //   const viewFormatId = id;
  //   dispatchUser({ type: "VIEW/SHOW", viewFormatId });
  // };

  const handleShowRSVPPage = (id) => {
    navigate(`single/${id}`);
  };

  const handleShowDelete = (id) => {
    const deleteFormatId = id;
    dispatchUser({ type: "DELETE/SHOW", deleteFormatId });
  };

  const handleHideDelete = () => {
    dispatchUser({ type: "DELETE/HIDE" });
  };

  const manageHideModal = () => {
    dispatchUser({ type: "EDIT/HIDE" });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  //Submit form
  const handleFormSubmit = async (data) => {
    if (data) {
      const creationDate = formatDate(new Date());
      const res = await postApiHandler(
        editShow ? `/admin/crm/crm/editRfqType/${editShowId}`
        : `/admin/crm/add-rfq-type`,
        {
          rfqType: data?.rfqType,
          rfqFormat: data?.rfqFormat,
          creationDate: creationDate,
          description: data?.description,
          createdBy: user?.email,
        }
      );

      if (res?.success) {
        uploadMediaHideModal();
        setShouldFetch((prev) => !prev);
        toast.success(editShow ? "RFQ Type Updated" : "RFQ Type Added");
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

  const handleUploadSubmit = async (data) => {
    if (data) {
      const creationDate = formatDate(new Date());
      const res = await postApiHandler(
        editShow ? `/admin/crm/crm/editRfqType/${editShowId}`
          : `/admin/crm/add-rfq-type`,
        {
          rfqType: data?.rfqType,
          rfqFormat: data?.rfqFormat,
          creationDate: creationDate,
          description: data?.description,
          createdBy: user?.email,
        }
      );

      if (res?.success) {
        uploadMediaHideModal();
        setShouldFetch((prev) => !prev);
        toast.success(editShow ? "RFQ Type Updated" : "RFQ Type Added");
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

  const handleDeleteAction = async () => {
    const res = await deleteApiHandler(`/admin/crm/deleteRfqType/${deleteId}`);
    if (res?.success) {
      handleHideDelete();
      toast.success("Rfq Type Deleted");
      setShouldFetch((prev) => !prev);
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data Not Found");
      } else {
        toast.warn("Something went wrong");
      }
    }
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
          <Box sx={{ maxWidth: 100 }}>{item?.rfqType || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 100 }}>{item?.creationDate || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 250 }}>{item?.rfqFormat || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          <Box sx={{ maxWidth: 100 }}>{item?.createdBy || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell align="right">
          <Stack justifyContent={"end"}>
            <Tooltip title="View">
              <IconButton onClick={() => handleShowViewModal(item?.customID)}>
                <RiEyeLine />
              </IconButton>
            </Tooltip>
            <Tooltip title="RSVP">
              <IconButton onClick={() => handleShowRSVPPage(item?.customID)}>
                <MdRsvp />
              </IconButton>
            </Tooltip>
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
      <PageHeader title={"RFQ Types"} handleAddClick={uploadMediaShowModal} />
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table
          sx={{ minWidth: 800 }}
          aria-label="customized table"
          size="small"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>#SI</StyledTableCell>
              <StyledTableCell>RFQ Type</StyledTableCell>
              <StyledTableCell>Creation Date</StyledTableCell>
              <StyledTableCell>RFQ Format</StyledTableCell>
              <StyledTableCell>Created By</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{contentRender}</TableBody>
        </Table>
      </TableContainer>

      {/* Upload RFQ Type */}
      <Modal
        isShowModal={addShow}
        title={"RFQ Types Information"}
        handleCloseModal={uploadMediaHideModal}
        width={"1200px"}
      >
        <UploadRfqModal
          handleCancel={uploadMediaHideModal}
          handleUploadSubmit={handleUploadSubmit}
          isEditMood={editShow}
          editMoodId={editShowId}
        />
      </Modal>
      {/* Edit Modal */}
      <Modal
        isShowModal={editShow}
        title={editShow ? "Edit RFQ Type" : "Add RFQ Type"}
        handleCloseModal={manageHideModal}
        width={"900px"}
      >
        <MediaList
          handleCancel={manageHideModal}
          handleFormSubmit={handleFormSubmit}
          isEditModal={editShow}
          id={editShowId}
          fetchPath={"crm"}
        />
      </Modal>
      {/* View Modal */}
      {/* <Modal
        isShowModal={viewShow}
        title={"View RFQ Type"}
        handleCloseModal={manageHideModal}
        width={"900px"}
      >
        <MediaList
          handleCancel={manageHideModal}
          handleFormSubmit={handleFormSubmit}
          isEditModal={viewShow}
          id={viewShowId}
          fetchPath={"crm"}
        />
      </Modal> */}
      <DeleteAlertModal
        isOpen={deleteShow}
        modifyText={"RFQ Type Info"}
        handleAlertClose={handleHideDelete}
        handleAlertAction={handleDeleteAction}
      />
    </Box>
  );
}

export default RfqTypeList;
