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
import UploadMedia from "./UploadMedia";
import MediaDetails from "./MediaDetails";
function ExhibitionListPage() {
    const IMG_URL = "https://api.neemsah.com";
    //const IMG_URL = "http://localhost:5500";
    //const IMG_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const [uploadMediaData, setUploadMediaData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [storeSelectedData, setStoreSelectedData] = useState(null);
  const [uploadMediaModal, setUploadMediaModal] = useState(false);
  const [attachmentInfoModal, setAttachmentInfoModal] = useState(false);
  const [{ isLoading, isError, errorMessage, fetchData }, dispatch] =
    useReducer(fetchReducer, initialFetchData);
  const [
    { addShow, editShow, editShowId, deleteShow, deleteId },
    dispatchUser,
  ] = useReducer(userActionReducer, initialAction);
  const [shouldFetch, setShouldFetch] = useState(false);

  //Show Upload modal
  const uploadMediaShowModal = () => {
    // dispatchUser({ type: "ADD/SHOW" });
    setUploadMediaModal(true);
  };
  //Hide Upload modal
  const uploadMediaHideModal = () => {
    //dispatchUser({ type: "ADD/EDIT/HIDE" });
    setUploadMediaModal(false);
  };

  //?Attachments Modal
  //Show attachments modal
  const attachmentsShowModal = (id) => {
    setStoreSelectedData(id);
    setAttachmentInfoModal(true);
  };

  //Hide attachments modal
  const attachmentsHideModal = () => {
    setAttachmentInfoModal(false);
  };

  const handleShowDelete = (id) => {
    const deleteFormatId = id;
    dispatchUser({ type: "DELETE/SHOW", deleteFormatId });
  };

  const handleHideDelete = () => {
    dispatchUser({ type: "DELETE/HIDE" });
  };

  const handleAlertClose = () => {
    setDeleteModal(false);
  };

  const handleDeleteAction = async () => {
    const res = await deleteApiHandler(`/admin/home/deleteExhibitionCard/${deleteId}`);
    if (res?.success) {
      handleHideDelete();
      toast.success("Exhibition Card Deleted");
      setShouldFetch((prev) => !prev);
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data Not Found");
      } else {
        toast.warn("Something went wrong");
      }
    }
  };

  const handleDelete = () => {
    setDeleteModal(true);
  };

  //Hide Delete  functionality
  const handleAlertAction = async () => {
    // console.log("Test");
    const res = await deleteApiHandler(
      `/admin/home/deleteExhibitionCard/${storeSelectedData}`
    );
    if (res?.success) {
      attachmentsHideModal();
      handleAlertClose();
      toast.success("Attachment Deleted");
      setShouldFetch((prev) => !prev);
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data Not Found");
      } else {
        toast.warn("Something went wrong");
      }
    }
  };

  //Submit file upload
  const handleUploadSubmit = async (data, uploadFiles) => {
    // console.log(
    //   data,
    //   "handleUploadSubmit - uploadFiles:",
    //   uploadFiles,
    //   uploadFiles[0]?.file
    // );
    if (uploadFiles?.length > 0) {
      const formData = new FormData();
      formData.append("title", data?.title ? data?.title : "");
      formData.append("division", data?.division ? data?.division : "");
      formData.append("date", data?.date ? data?.date : "");
      formData.append("headline", data?.headline ? data?.headline : "");
      formData.append("description", data?.description ? data?.description : "");
      formData.append(
        "type",
        uploadFiles[0]?.file?.type?.includes("video") ? "video" : "image"
      );
      formData.append("files", uploadFiles[0]?.file);
      const res = await postApiHandler(`/admin/home/exhibition-card-upload`, formData);
      // console.log("handleUploadSubmit - res:", res);
      if (res?.success) {
        uploadMediaHideModal();
        setShouldFetch((prev) => !prev);
        toast.success("Attachment Uploaded");
      } else {
        if (res?.response?.status === 404) {
          toast.warn("Record Not Found");
        } else {
          toast.warn("Something went wrong");
        }
      }
    } else {
      toast.info("Please upload attachment first");
    }
  };

  const handleAttachmentSubmit = async (data, files) => {
    const formData = new FormData();
    formData.append("title", data?.title ? data?.title : "");
    formData.append("division", data?.division ? data?.division : "");
    formData.append("date", data?.date ? data?.date : "");
    formData.append("headline", data?.headline ? data?.headline : "");
    formData.append("description", data?.description ? data?.description : "");
    formData.append("files", files[0]);
    const res = await postApiHandler(
      `/admin/home/editExhibitionCard/${storeSelectedData}`,
      formData
    );

    if (res?.success) {
      attachmentsHideModal();
      toast.success("Attachment Updated");
      setShouldFetch((prev) => !prev);
    } else {
      if (res?.response?.status === 404) {
        setErrorMessage({ isError: true, message: "Data Not Found" });
      } else {
        setErrorMessage({ isError: true, message: null });
      }
    }
  };

  const getMedia = async () => {
    dispatch({ type: "LOADING" });
    const res = await getApiHandler("/admin/home/allExhibitionCard", {
      position: "home",
    });
    //console.log("ressssss", res);
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
    //console.log("fetchData", fetchData);
    contentRender = fetchData?.map((item, index) => (
      <StyledTableRow key={item?._id}>
        <StyledTableCell component="th" scope="row">
          {index + 1}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 100 }}>{item?.title || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell align="start">
          {item?.path ? (
            item?.path.includes(".mp4") ? (
              <Box sx={{ width: 80, height: 70, position: "relative" }}>
                <Box
                  component={"video"}
                  src={`${IMG_URL}/${item?.path}`}
                  sx={{ width: 1, height: "100%" }}
                ></Box>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                  }}
                >
                  <AiOutlinePlayCircle size={22} color="#4fb5e5" />
                </Box>
              </Box>
            ) : (
              <Avatar
                alt={item?.title}
                src={`${IMG_URL}/${item?.path}`}
                variant="rounded"
                sx={{ width: 70, height: 80 }}
              />
            )
          ) : (
            "N/A"
          )}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 100 }}>{item?.division || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 120 }}>{item?.date || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 150 }}>{item?.headline || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 250 }}>{item?.description || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell align="right">
          <Stack justifyContent={"end"}>
            <Tooltip title="Edit">
              <IconButton onClick={() => attachmentsShowModal(item?.customID)}>
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
      <PageHeader title={"Exhibition Card List"} handleAddClick={uploadMediaShowModal} />
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          size="small"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>#SI</StyledTableCell>
              <StyledTableCell>Exhibition Title</StyledTableCell>
              <StyledTableCell>Exhibition Image</StyledTableCell>
              <StyledTableCell>Exhibition Division</StyledTableCell>
              <StyledTableCell>Exhibition Date</StyledTableCell>
              <StyledTableCell>Exhibition Headline</StyledTableCell>
              <StyledTableCell>Exhibition Description</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{contentRender}</TableBody>
        </Table>
      </TableContainer>
      <Modal
        isShowModal={uploadMediaModal}
        title={"Upload Exhibition Card Details"}
        handleCloseModal={uploadMediaHideModal}
        width={"1200px"}
      >
        <UploadMedia
          handleCancel={uploadMediaHideModal}
          handleUploadSubmit={handleUploadSubmit}
        />
      </Modal>

      {/* Attachment details info  */}
      <Modal
        isShowModal={attachmentInfoModal}
        title={"Exhibition Card Details"}
        handleCloseModal={attachmentsHideModal}
        width={"1200px"}
      >
        <MediaDetails
          handleAttachmentSubmit={handleAttachmentSubmit}
          handleCancel={attachmentsHideModal}
          id={storeSelectedData}
          handleDelete={handleDelete}
          handleAlertClose={handleAlertClose}
          handleAlertAction={handleAlertAction}
          deleteModal={deleteModal}
        />
      </Modal>

      {/* Delete Modal  */}
      <DeleteAlertModal
        isOpen={deleteShow}
        modifyText={"Exhibition Card Section"}
        handleAlertClose={handleHideDelete}
        handleAlertAction={handleDeleteAction}
      />
    </Box>
  );
}

export default ExhibitionListPage;
