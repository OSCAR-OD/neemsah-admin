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
import React, {Fragment, useEffect, useReducer, useState } from "react";
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
import PageHeader from "../../../Components/PageHeader/PageHeaderRaw";
import MediaList from "../../../Components/Modal/Crm/CustomerMediaList";
import UploadMedia from "../../../Components/Modal/Crm/UploadCustomerModal";

function CustomersListPage() {
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
  const [uploadMediaModal, setUploadMediaModal] = useState(false);

  //Show Upload modal
  const uploadMediaShowModal = () => {
    setUploadMediaModal(true);
  };

  const uploadMediaShowModal2 = () => {
    dispatchUser({ type: "ADD/SHOW" });
  };

  //Hide Upload modal
  const manageHideModal = () => {
    dispatchUser({ type: "ADD/HIDE" });
    dispatchUser({ type: "EDIT/HIDE" });
  };

  const uploadMediaHideModal = () => {
    setUploadMediaModal(false);
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

  const handleHideDelete = () => {
    dispatchUser({ type: "DELETE/HIDE" });
  };

  //Delete functionality
  const handleDeleteAction = async () => {
    const res = await deleteApiHandler(`/admin/crm/deleteCustomer/${deleteId}`);
    if (res?.success) {
      handleHideDelete();
      toast.success("Customer Deleted");
      setShouldFetch((prev) => !prev);
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data Not Found");
      } else {
        toast.warn("Something went wrong");
      }
    }
  };

  // Function to format the date
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  //Submit form
  const handleFormSubmit = async (data, selectedAttachment) => {
    if (selectedAttachment?.length > 0) {
      const formatImage = selectedAttachment?.map((row) => row?._id);
      const creationDate = formatDate(new Date());
      const res = await postApiHandler(
        editShow
          ? `/admin/crm/editCustomer/${editShowId}`
          : `/admin/crm/addCustomer`,
        {
          companyName: data?.companyName,
          cid: data?.cid,
          description: data?.description,
          creationDate: creationDate,
          images: formatImage,
          position: "crmCustomer",
        }
      );

      if (res?.success) {
        manageHideModal();
        setShouldFetch((prev) => !prev);
        toast.success(editShow ? "Customer Updated" : "Customer Added");
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

  //Submit file upload
  const handleUploadSubmit = async (data, uploadFiles) => {
    if (uploadFiles?.length > 0) {
      const formData = new FormData();
      formData.append("name", data?.name ? data?.name : "");
      formData.append("description", data?.description);
      formData.append("type", uploadFiles[0]?.file?.type?.includes("video") ? "video" : "image");
      formData.append("files", uploadFiles[0]?.file);
      const res = await postApiHandler(`/admin/customers/uploadCustomerTab`, formData);
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
  //Get all media attachments
  const getMedia = async () => {
    dispatch({ type: "LOADING" });
    const res = await getApiHandler("/admin/crm/allCustomers");
    //console.log("res", res);
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
          <Box sx={{ maxWidth: 200 }}>{item?.cid || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 200 }}>{item?.companyName || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell>
          <Stack gap={1}>
            {item?.images && item?.images?.length > 0
              ? item?.images?.map((item) => {
                  return (
                    <Fragment key={item?.id}>
                     <Avatar
                        src={`${IMG_URL}/${item?.path}`}
                        altText={item?.name}
                        variant="rounded"
                        sx={{ width: 70,
                          height: 70,
                          '& > img':{
                          objectFit: 'contain',
                          height: '100%',
                          }
                         }}
                      />
                    </Fragment>
                  );
                })
              : "N/A"}
          </Stack>
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 200 }}>{item?.creationDate || "N/A"}</Box>{" "}
        </StyledTableCell>
        <StyledTableCell align="right">
          <Stack justifyContent={"end"}>
            <Tooltip title="Edit">
              <IconButton onClick={() => handleShowEditModal(item?.customID)}>
                <BiEdit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={() => handleShowDeleteModal(item?.customID)}>
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
      <PageHeader title={"Customers List"} handleAddClick={uploadMediaShowModal} handleAddClick2={uploadMediaShowModal2} />
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          size="small"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>#SI</StyledTableCell>
              <StyledTableCell>CID</StyledTableCell>
              <StyledTableCell>Company Name</StyledTableCell>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell>Creation Date</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{contentRender}</TableBody>
        </Table>
      </TableContainer>
      {/* Upload Media  */}
      <Modal
        isShowModal={uploadMediaModal}
        title={"Upload Customers Details"}
        handleCloseModal={uploadMediaHideModal}
        width={"1200px"}
      >
        <UploadMedia
          handleCancel={uploadMediaHideModal}
          handleUploadSubmit={handleUploadSubmit}
        />
      </Modal>
      {/* Select Media  */}
      <Modal
        isShowModal={addShow || editShow}
        title={editShow ? "Edit Customer" : "Add Customer"}
        handleCloseModal={manageHideModal}
        width={"900px"}
      >
        <MediaList
          handleCancel={manageHideModal}
          handleFormSubmit={handleFormSubmit}
          isEditModal={editShow}
          id={editShowId}
          fetchPath={"customer"}
        />
      </Modal>
      <DeleteAlertModal
        isOpen={deleteShow}
        modifyText={"Employee Info"}
        handleAlertClose={handleHideDelete}
        handleAlertAction={handleDeleteAction}
      />
    </Box>
  );
}

export default CustomersListPage;
