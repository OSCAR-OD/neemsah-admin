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
import { AiOutlineDelete, AiOutlinePlayCircle } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { toast } from "react-toastify";
import {
  deleteApiHandler,
  fetchReducer,
  getApiHandler,
  initialFetchData,
  postApiHandler,
} from "../../lib/axios/ApiHelper";
import {
  initialAction,
  userActionReducer,
} from "../../utils/Action/ManageUserAction";
import TableSkeleton from "../Skeleton/Table/TableSkeleton";
import ErrorMessage from "../Error/ErrorMessage";
import DataNotFoundTable from "../NotFound/DataNotFoundTable";
import {
  StyledTableCell,
  StyledTableRow,
} from "../CustomStyle/table/TableStyle";
import PageHeader from "../PageHeader/PageHeader";
import MediaBannerAllList from "../Media/MediaBannerAllList";
import DeleteAlertModal from "../Alert/DeleteAlertModal";
import Modal from "../Modal/Modal";

function BannerPage({ bannerTitle, position, message }) {
  const [{ isLoading, isError, errorMessage, fetchData }, dispatch] =
    useReducer(fetchReducer, initialFetchData);
  const [
    { addShow, editShow, editShowId, deleteShow, deleteId },
    dispatchUser,
  ] = useReducer(userActionReducer, initialAction);
  const [shouldFetch, setShouldFetch] = useState(false);
  //console.log("BannerPage - addShow:", addShow);
  //?Upload Media Modal
  //Show Upload modal
  const uploadMediaShowModal = () => {
    //console.log("click");

    dispatchUser({ type: "ADD/SHOW" });
  };
  //Hide Upload modal
  const uploadMediaHideModal = () => {
    dispatchUser({ type: "ADD/EDIT/HIDE" });
  };

  //?Banner edit Modal
  //Show Banner modal
  const handleShowEditModal = (id) => {
    const editFormatId = id;
    dispatchUser({ type: "EDIT/SHOW", editFormatId });
  };

  //?Banner modal
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
        editShow ? `/admin/banner/edit/${editShowId}` : `/admin/banner/add`,
        {
          title: data?.title,
          link: data?.description,
          position: position,
          image: selectId[0],
        }
      );

      if (res?.success) {
        uploadMediaHideModal();
        setShouldFetch((prev) => !prev);
        toast.success(
          editShow ? `${message} Banner Updated` : `${message} Banner Added`
        );
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
    const res = await deleteApiHandler(`/admin/banner/delete/${deleteId}`);
    if (res?.success) {
      handleHideDelete();
      toast.success("Banner Deleted");
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
    const res = await getApiHandler("/admin/banner/all", {
      position: position,
    });
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
        <StyledTableCell>
          <Box sx={{ maxWidth: 100 }}>
            {" "}
            {item?.link ? (
              <a href={item?.link} target="_blank" rel="noreferrer">
                {item?.link}
              </a>
            ) : (
              "N/A"
            )}
          </Box>{" "}
        </StyledTableCell>
        <StyledTableCell align="start">
          {item?.image || item?.image?.length > 0 ? (
            item?.type?.includes("video") ? (
              <Box sx={{ width: 70, height: 70, position: "relative" }}>
                <Box
                  component={"video"}
                  src={`${import.meta.env.VITE_APP_ATTACHMENT_URL}/${
                    item?.path
                  }`}
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
                src={`${import.meta.env.VITE_APP_ATTACHMENT_URL}/${
                  item?.image?.path
                }`}
                variant="rounded"
                sx={{ width: 70, height: 70 }}
              />
            )
          ) : (
            "N/A"
          )}
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
      <PageHeader
        title={`${bannerTitle} Clients List`}
        handleAddClick={uploadMediaShowModal}
      />

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
              <StyledTableCell>Link</StyledTableCell>
              <StyledTableCell>Attachment</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{contentRender}</TableBody>
        </Table>
      </TableContainer>

      <Modal
        isShowModal={addShow || editShow}
        title={"Select Attachments"}
        handleCloseModal={uploadMediaHideModal}
        width={"1200px"}
      >
        <MediaBannerAllList
          handleCancel={uploadMediaHideModal}
          handleAttachmentsSubmit={handleAttachmentsSubmit}
          isEditMood={editShow}
          editMoodId={editShowId}
        />
      </Modal>

      {/* Delete Modal  */}
      <DeleteAlertModal
        isOpen={deleteShow}
        modifyText={`${position} banner`}
        handleAlertClose={handleHideDelete}
        handleAlertAction={handleDeleteAction}
      />
    </Box>
  );
}

BannerPage.defaultProps = {
  bannerTitle: "Banner",
  message: "Banner",
  position: "",
};
export default BannerPage;
