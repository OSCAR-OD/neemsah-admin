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
import React, { Fragment, useEffect, useReducer, useState } from "react";
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
import ImageVideoItem from "../Table/ImageVideo/ImageVideoItem";
import MediaAllList from "../Media/MediaAllList";

function GalleryPage({ bannerTitle, path, message }) {
  const [{ isLoading, isError, errorMessage, fetchData }, dispatch] =
    useReducer(fetchReducer, initialFetchData);
  const [
    { addShow, editShow, editShowId, deleteShow, deleteId },
    dispatchUser,
  ] = useReducer(userActionReducer, initialAction);
  const [shouldFetch, setShouldFetch] = useState(false);
  // console.log("BannerPage - addShow:", addShow);

  //?Upload Media Modal
  //Show Upload modal
  const uploadMediaShowModal = () => {
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
  const handleAttachmentsSubmit = async (e, selectId) => {
    e.preventDefault();
   // console.log(selectId, "handleAttachmentsSubmit - data:");
    if (selectId?.length > 0) {
      const formatId = selectId?.map((item) => item?._id);
      const res = await postApiHandler(
        editShow ? `/admin/${path}/edit/${editShowId}` : `/admin/${path}/add`,
        {
          images: formatId,
        }
      );

      if (res?.success) {
        uploadMediaHideModal();
        setShouldFetch((prev) => !prev);
        toast.success(
          editShow
            ? `${bannerTitle} Gallery Updated`
            : `${bannerTitle} Gallery Added`
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
    const res = await deleteApiHandler(`/admin/${path}/delete/${deleteId}`);
    if (res?.success) {
      handleHideDelete();
      toast.success(`${bannerTitle} Deleted`);
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
    const res = await getApiHandler(`/admin/${path}/all`);
    if (res?.success) {
      const dataFormat = res.data;
     // console.log("getMedia - dataFormat:", dataFormat);
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
      <TableSkeleton
        isShowTitle={false}
        numberOfImage={3}
        isShowDescription={false}
      />
    );
  } else if (isError) {
    return <ErrorMessage message={errorMessage} />;
  } else if (fetchData?.length <= 0) {
    contentRender = <DataNotFoundTable column={5} />;
  } else if (fetchData?.length > 0) {
    contentRender = fetchData?.map((row, index) => (
      <StyledTableRow key={row?._id}>
        <StyledTableCell component="th" scope="row">
          {index + 1}
        </StyledTableCell>

        <StyledTableCell align="start">
          <Stack gap={1}>
            {row?.images && row?.images?.length > 0
              ? row?.images?.map((item) => {
                  return (
                    <Fragment key={item?._id}>
                      <ImageVideoItem
                        type={""}
                        path={item?.path}
                        altText={row?.description}
                      />
                    </Fragment>
                  );
                })
              : "N/A"}
          </Stack>
        </StyledTableCell>
        <StyledTableCell align="right">
          <Stack justifyContent={"end"}>
            <Tooltip title="Edit">
              <IconButton onClick={() => handleShowEditModal(row?.customID)}>
                <BiEdit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={() => handleShowDelete(row?.customID)}>
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
        title={`${bannerTitle} Gallery List`}
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
              <StyledTableCell>Attachment</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody> {contentRender}</TableBody>
        </Table>
      </TableContainer>

      <Modal
        isShowModal={addShow || editShow}
        title={"Select Attachments"}
        handleCloseModal={uploadMediaHideModal}
        width={"1200px"}
      >
        <MediaAllList
          handleCancel={uploadMediaHideModal}
          handleAttachmentsSubmit={handleAttachmentsSubmit}
          isEditMood={editShow}
          id={editShowId}
          // previousSelectedImage={fetchData?.map((item) => item?._id)}
          singleFetchPath={path}
        />
      </Modal>

      {/* Delete Modal  */}
      <DeleteAlertModal
        isOpen={deleteShow}
        modifyText={`${message} gallery list`}
        handleAlertClose={handleHideDelete}
        handleAlertAction={handleDeleteAction}
      />
    </Box>
  );
}

GalleryPage.defaultProps = {
  bannerTitle: "Banner",
  message: "Banner",
  path: "",
};
export default GalleryPage;
