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
import MediaHeroAllList from "../../../Components/Media/List/MediaHeroAllList";
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

function MessageListPage() {
   //const IMG_URL = "https://api.neemsah.com";
   const IMG_URL = "http://localhost:5500";
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

  //Attachment submit
  const handleAttachmentsSubmit = async (data, selectId) => {
    if (selectId?.length > 0) {
      const res = await postApiHandler(
        editShow ? `/admin/hero/edit/${editShowId}` : `/admin/hero/add`,
        {
          title: data?.title,
          link: data?.link,
          position: "message",
          image: selectId[0],
          description: data?.description,
        }
      );

      if (res?.success) {
        uploadMediaHideModal();
        setShouldFetch((prev) => !prev);
        toast.success(editShow ? "Ceo's Message Updated" : "Ceo's Message Added");
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

  //Hide Delete  functionality
  const handleDeleteAction = async () => {
    const res = await deleteApiHandler(`/admin/hero/delete/${deleteId}`);
    if (res?.success) {
      handleHideDelete();
      toast.success("Hero Deleted");
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
    const res = await getApiHandler("/admin/hero/all", {
      position: "message",
    });
    console.log("ressssss", res );
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
          <Box sx={{ maxWidth: 200 }}>{item?.title || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell align="start">
          {item?.image || item?.image?.length > 0 ? (
            item?.type?.includes("video") ? (
              <Box sx={{ width: 70, height: 70, position: "relative" }}>
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
                  {" "}
                  <AiOutlinePlayCircle size={22} color="#4fb5e5" />{" "}
                </Box>
              </Box>
            ) : (
              <Avatar
                alt={item?.title}
                src={`${IMG_URL}/${item?.path}`}
                variant="rounded"
                sx={{ width: 70, height: 70 }}
              />
            )
          ) : (
            "N/A"
          )}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 200 }}>{item?.description || "N/A"}</Box>{" "}
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
      <PageHeader title={"Ceo's Message List"} handleAddClick={uploadMediaShowModal} />

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          size="small"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>#SI</StyledTableCell>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Attachment</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{contentRender}</TableBody>
        </Table>
      </TableContainer>

      {/* Upload Media  */}
      <Modal
        isShowModal={addShow || editShow}
        title={"Select Attachments"}
        handleCloseModal={uploadMediaHideModal}
        width={"1200px"}
      >
        <MediaHeroAllList
          handleCancel={uploadMediaHideModal}
          handleAttachmentsSubmit={handleAttachmentsSubmit}
          isEditMood={editShow}
          editMoodId={editShowId}
        />
      </Modal>

      {/* Delete Modal  */}
      <DeleteAlertModal
        isOpen={deleteShow}
        modifyText={"Ceo's Message Delete"}
        handleAlertClose={handleHideDelete}
        handleAlertAction={handleDeleteAction}
      />
    </Box>
  );
}

export default MessageListPage;
