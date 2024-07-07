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
import MediaList from "../../../Components/Modal/Crm/UploadProjectModal";
import { useAuth } from "../../../Context/Auth/UseAuth";
function ProjectsListPage() {
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

  // Function to format the date
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  //Form submit
  const handleFormSubmit = async (data) => {
    //console.log("data", data);
    if (data != null) {
      const initiationDate = formatDate(new Date());
      const res = await postApiHandler(
        editShow ? `/admin/crm/editProject/${editShowId}`
          : `/admin/crm/addProject`,
        {
          pid: data?.pid,
          projectName: data?.projectName,
          cid: data?.cid,
          companyName: data?.companyName,
          application: data?.application,
          assignedEmployee: data?.assignedEmployee,
          initiationDate: initiationDate,
          description: data?.description,
          createdBy: user?.email,
          lastEditedBy: user?.email,
        }
      );

      if (res?.success) {
        uploadMediaHideModal();
        setShouldFetch((prev) => !prev);
        toast.success(editShow ? "Project Info Updated" : "Project Created");
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
    const res = await deleteApiHandler(`/admin/crm/deleteProject/${deleteId}`);
    if (res?.success) {
      handleHideDelete();
      toast.success("Project Deleted");
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
    const res = await getApiHandler("/admin/crm/allProjects");
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
    contentRender = <DataNotFoundTable column={9} />;
  } else if (fetchData?.length > 0) {
    contentRender = fetchData?.map((item, index) => (
      <StyledTableRow key={item?._id}>
        <StyledTableCell component="th" scope="row">
          {index + 1}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ minWidth: 100, maxWidth: 400 }}>{item?.pid || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{minWidth: 90, maxWidth: 400 }}>{item?.initiationDate || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{minWidth: 90, maxWidth: 400 }}>{item?.projectName || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ minWidth: 100, maxWidth: 400 }}>{item?.companyName || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ minWidth: 100, maxWidth: 400 }}>{item?.application || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ minWidth: 100, maxWidth: 400 }}>{item?.assignedEmployee || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{minWidth: 100, maxWidth: 400}}>{item?.createdBy || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ minWidth: 100, maxWidth: 400 }}>{item?.lastEditedBy || "N/A"}</Box>{" "}
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
      <PageHeader title={"Project's List"} handleAddClick={uploadMediaShowModal} />
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          size="small"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>#SI</StyledTableCell>
              <StyledTableCell>PID</StyledTableCell>
              <StyledTableCell>Initiation Date</StyledTableCell>
              <StyledTableCell>Project Name</StyledTableCell>
              <StyledTableCell>Company Name</StyledTableCell>
              <StyledTableCell>Application</StyledTableCell>
              <StyledTableCell>Assigned Employee</StyledTableCell>
              <StyledTableCell>Created By</StyledTableCell>
              <StyledTableCell>Last Edited By</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{contentRender}</TableBody>
        </Table>
      </TableContainer>

      <Modal
        isShowModal={addShow || editShow}
        title={"Project Information"}
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
        modifyText={"Project Info"}
        handleAlertClose={handleHideDelete}
        handleAlertAction={handleDeleteAction}
      />
    </Box>
  );
}

export default ProjectsListPage;
