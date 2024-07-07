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
import { Fragment, useEffect, useReducer, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
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
import { toast } from "react-toastify";
import TableSkeleton from "../Skeleton/Table/TableSkeleton";
import ErrorMessage from "../Error/ErrorMessage";
import DataNotFoundTable from "../NotFound/DataNotFoundTable";
import {
  StyledTableCell,
  StyledTableRow,
} from "../CustomStyle/table/TableStyle";
import PageHeader from "../PageHeader/PageHeader";
import Modal from "../Modal/Modal";
import DeleteAlertModal from "../Alert/DeleteAlertModal";
import FeaturesManageModal from "../Modal/Features/FeaturesManageModal";
import ImageVideoItem from "../Table/ImageVideo/ImageVideoItem";

function ServicePage({ title, message, toastMessage, path, singleFetchPath }) {
  const [{ isLoading, isError, errorMessage, fetchData }, dispatch] =
    useReducer(fetchReducer, initialFetchData);
  const [
    { addShow, editShow, editShowId, deleteShow, deleteId },
    dispatchUser,
  ] = useReducer(userActionReducer, initialAction);
  const [shouldFetch, setShouldFetch] = useState(false);

  //?Upload Media Modal
  //Show Upload modal
  const manageShowModal = () => {
    dispatchUser({ type: "ADD/SHOW" });
  };
  //Hide Upload modal
  const manageHideModal = () => {
    dispatchUser({ type: "ADD/HIDE" });
    dispatchUser({ type: "EDIT/HIDE" });
  };

  //Show edit modal
  const handleShowEditModal = (id) => {
    const editFormatId = id;
    dispatchUser({ type: "EDIT/SHOW", editFormatId });
  };

  //?Delete modal
  const handleShowDeleteModal = (id) => {
    const deleteFormatId = id;
    dispatchUser({ type: "DELETE/SHOW", deleteFormatId });
  };
  const handleHideDeleteModal = () => {
    dispatchUser({ type: "DELETE/HIDE" });
  };

  //Delete functionality
  const handleDeleteAction = async () => {
    const res = await deleteApiHandler(`/admin/${path}/delete/${deleteId}`);
    if (res?.success) {
      handleHideDeleteModal();
      toast.success(`${toastMessage} List Deleted`);
      setShouldFetch((prev) => !prev);
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data Not Found");
      } else {
        toast.warn("Something went wrong");
      }
    }
  };

  //Submit form
  const handleFormSubmit = async (data, selectedAttachment) => {
    if (selectedAttachment?.length > 0) {
      const formatImage = selectedAttachment?.map((row) => row?._id);
      const res = await postApiHandler(
        editShow ? `/admin/${path}/edit/${editShowId}` : `/admin/${path}/add`,
        {
          title: data?.mainTitle,
          totalCapacity: data?.totalCapacity,
          settingCapacity: data?.settingCapacity,
          description: data?.description,
          btnLink: data?.buttonLink,
          images: formatImage,
        }
      );

      if (res?.success) {
        manageHideModal();
        setShouldFetch((prev) => !prev);
        toast.success(
          editShow ? `${toastMessage} Updated` : `${toastMessage}  Added`
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

  //Get all list
  const getFetchList = async () => {
    dispatch({ type: "LOADING" });
    const res = await getApiHandler(`/admin/${path}/all`);
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
    getFetchList();
  }, [shouldFetch]);

  //Condition Render
  let contentRender;

  if (isLoading) {
    contentRender = (
      <TableSkeleton isShowLink={true} numberOfImage={2} numberOfTitle={3} />
    );
  } else if (isError) {
    return <ErrorMessage message={errorMessage} />;
  } else if (fetchData?.length <= 0) {
    contentRender = <DataNotFoundTable column={8} />;
  } else if (fetchData?.length > 0) {
    contentRender = fetchData?.map((row, index) => (
      <StyledTableRow key={row?._id}>
        <StyledTableCell component="th" scope="row">
          {index + 1}
        </StyledTableCell>

        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 170 }}>{row?.title || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 150 }}>{row?.totalCapacity ?? "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 150 }}>{row?.settingCapacity ?? "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {row?.description ? (
            <Box sx={{ maxWidth: 200 }}>{row?.description}</Box>
          ) : (
            "N/A"
          )}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 160 }}>
            {" "}
            {row?.btnLink ? (
              <a href={row?.btnLink} target="_blank" rel="noreferrer">
                {row?.btnLink}
              </a>
            ) : (
              "N/A"
            )}
          </Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          <Stack gap={1}>
            {row?.images && row?.images?.length > 0
              ? row?.images?.map((item) => {
                  return (
                    <Fragment key={item?.id}>
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
              <IconButton onClick={() => handleShowDeleteModal(row?.customID)}>
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
      <PageHeader title={title} handleAddClick={manageShowModal} />
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
              <StyledTableCell>Total Capacity</StyledTableCell>
              <StyledTableCell>Seating Capacity</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Button Link</StyledTableCell>
              <StyledTableCell>images</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{contentRender}</TableBody>
        </Table>
      </TableContainer>

      {/* Mange  Modal  */}
      <Modal
        isShowModal={addShow || editShow}
        title={editShow ? `Edit ${toastMessage}` : `Add ${toastMessage}`}
        handleCloseModal={manageHideModal}
        width={"900px"}
      >
        <FeaturesManageModal
          handleCancel={manageHideModal}
          handleFormSubmit={handleFormSubmit}
          isEditModal={editShow}
          id={editShowId}
          singleFetchPath={singleFetchPath}
        />
      </Modal>

      {/*  Delete Modal  */}
      <DeleteAlertModal
        isOpen={deleteShow}
        modifyText={`${message} List`}
        handleAlertClose={handleHideDeleteModal}
        handleAlertAction={handleDeleteAction}
      />
    </Box>
  );
}

export default ServicePage;
