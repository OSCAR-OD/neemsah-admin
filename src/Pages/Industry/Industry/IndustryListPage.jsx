import {
  Avatar,
  Box, Grid,
  IconButton, List, ListItem, ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from '@mui/material/Icon';
import PageHeader from "../../../Components/PageHeader/PageHeader";
import { Fragment, useEffect, useReducer, useState } from "react";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../Components/CustomStyle/table/TableStyle";
import { AiOutlineDelete } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { RiEditBoxLine } from "react-icons/ri";
import Modal from "../../../Components/Modal/Modal";
import {
  deleteApiHandler,
  fetchReducer,
  getApiHandler,
  initialFetchData,
  postApiHandler,
} from "../../../lib/axios/ApiHelper";
import {
  initialAction,
  userActionReducer,
} from "../../../utils/Action/ManageUserAction";
import DataNotFoundTable from "../../../Components/NotFound/DataNotFoundTable";
import ErrorMessage from "../../../Components/Error/ErrorMessage";
import TableSkeleton from "../../../Components/Skeleton/Table/TableSkeleton";
import { toast } from "react-toastify";
import DeleteAlertModal from "../../../Components/Alert/DeleteAlertModal";
import UploadMedia from "../../../Components/Media/Upload/UploadIndustryMedia";
import MediaList from "../../../Components/Modal/Industry/IndustryManageModal";
import { useNavigate } from 'react-router-dom';
function IndustryListPage() {
  const navigate = useNavigate();
  const [{ isLoading, isError, errorMessage, fetchData }, dispatch] =
    useReducer(fetchReducer, initialFetchData);
  const [
    { addShow, editShow, editShowId, deleteShow, deleteId },
    dispatchUser,
  ] = useReducer(userActionReducer, initialAction);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [uploadMediaModal, setUploadMediaModal] = useState(false);

  const uploadMediaShowModal = () => {
    setUploadMediaModal(true);
  };
  const uploadMediaHideModal = () => {
    setUploadMediaModal(false);
  };
  const handleShowEditModal = (id) => {
    const editFormatId = id;
    dispatchUser({ type: "EDIT/SHOW", editFormatId });
  };
  const handleShowViewPage = (id) => {
    navigate(`/cms/industry/industry-list/single/${id}`);
  };
  const manageHideModal = () => {
    dispatchUser({ type: "ADD/HIDE" });
    dispatchUser({ type: "EDIT/HIDE" });
  };
  const handleShowDeleteModal = (id) => {
    const deleteFormatId = id;
    dispatchUser({ type: "DELETE/SHOW", deleteFormatId });
  };
  const handleHideDelete = () => {
    dispatchUser({ type: "DELETE/HIDE" });
  };
  const handleDeleteAction = async () => {
    const res = await deleteApiHandler(`/admin/industry/deleteIndustryNav/${deleteId}`);
    if (res?.success) {
      handleHideDelete();
      manageHideModal();
      toast.success("Industry Navbar Deleted");
      setShouldFetch((prev) => !prev);
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data Not Found");
      } else {
        toast.warn("Something went wrong");
      }
    }
  };

  const handleUploadSubmit = async (data) => {
    //console.log("data", data);
    const res = await postApiHandler(
      editShow
        ? `/admin/industry/editIndustryNav/${editShowId}`
        : `/admin/industry/addIndustryNav`,
      {
        name: data?.name,
        slug: data?.slug,
        grandParent: data?.grandParentSelect,
        parent: data?.parentSelect,
      }
    );

    if (res?.success) {
      uploadMediaHideModal();
      setShouldFetch((prev) => !prev);
      toast.success("Navbar Added");
    } else {
      toast.warn("Something went wrong");
    }
  };
  //Submit form
  const handleFormSubmit = async (data) => {
    const res = await postApiHandler(
      editShow
        ? `/admin/industry/editIndustryNav/${editShowId}`
        : `/admin/industry/addIndustryNav`,
      {
        name: data?.name,
        slug: data?.slug,
        grandParent: data?.grandParentSelect,
        parent: data?.parentSelect,
      }
    );

    if (res?.success) {
      manageHideModal();
      setShouldFetch((prev) => !prev);
      toast.success(editShow ? "Industry Navbar Updated" : "Industry Navbar Added");
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data not found");
      } else {
        toast.warn("Something went wrong");
      }
    }
  };

  const getFetchList = async () => {
    dispatch({ type: "LOADING" });
    const res = await getApiHandler("admin/industry/allIndustryNav");
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
    getFetchList();
  }, [shouldFetch]);

  let contentRender;
  let finalDataSet = [];

  if (isLoading) {
    contentRender = <TableSkeleton numberOfImage={2} />;
  } else if (isError) {
    return <ErrorMessage message={errorMessage} />;
  } else if (fetchData?.length <= 0) {
    contentRender = <DataNotFoundTable column={6} />;
  } else if (fetchData?.length > 0) {
    // console.log("fetchData", fetchData);
    let final = fetchData.filter(item => !item.parent && !item.grandParent);
    for (let i = 0; i < final.length; i++) {
      final[i].rowSpan = 0;
      final[i].sub = fetchData.filter(item => item.grandParent?._id === final[i]._id && !item.parent);
      for (let j = 0; j < final[i].sub.length; j++) {
        final[i].sub[j].industries = fetchData.filter(item => item.parent?._id === final[i].sub[j]._id);
        final[i].rowSpan += final[i].sub[j].industries.length;
      }
    }
    finalDataSet = final;
  }
  const listStyle = {
    backgroundColor: '#4e4e57',
    marginBottom: '5px',
    padding: '8px 20px',
    borderRadius: '5px',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  return (
    <Box>
      <PageHeader
        title={"Industries and it's pages"}
        handleAddClick={uploadMediaShowModal}
      />
      <Grid xs={12} md={6}>
        <div>
          {finalDataSet.map((item, index) => <div key={index}>
            <div style={{ ...listStyle, backgroundColor: '#2b5ed5' }}>
              <p>{item.name}</p>
              <StyledTableCell sx={{ padding: 0, margin: 0, textDecoration: 'none', border: "none" }} align="right">
                <Stack sx={{ padding: 0, margin: 0, textDecoration: 'none', border: "none" }} justifyContent={"end"}>
                  <Tooltip title="Edit">
                    <IconButton sx={{ color: "#ffffff", textDecoration: 'none', border: "none" }} onClick={() => handleShowEditModal(item?.customID)}>
                      <BiEdit size={20} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton sx={{ color: "#ffffff", border: "none" }} onClick={() => handleShowDeleteModal(item?.customID)}>
                      <AiOutlineDelete size={20} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </StyledTableCell>
            </div>
            {item.sub.map((value, index2) => <div key={index2}>
              <div style={{ ...listStyle, backgroundColor: '#44abd0', marginLeft: '20px' }}>
                <p>{value.name}</p>
                <StyledTableCell sx={{ padding: 0, margin: 0, textDecoration: 'none', border: "none" }} align="right">
                  <Stack sx={{ padding: 0, margin: 0, textDecoration: 'none', border: "none" }} justifyContent={"end"}>
                    {!value.industries.length ?
                      <Tooltip title="View">
                        <IconButton sx={{ color: "#ffffff", textDecoration: 'none', border: "none" }} onClick={() => handleShowViewPage(value?.customID)}>
                          <RiEditBoxLine size={20} />
                        </IconButton>
                      </Tooltip>
                      : null}
                    <Tooltip title="Edit">
                      <IconButton sx={{ color: "#ffffff", textDecoration: 'none', border: "none" }} onClick={() => handleShowEditModal(value?.customID)}>
                        <BiEdit size={20} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton sx={{ color: "#ffffff", border: "none" }} onClick={() => handleShowDeleteModal(value?.customID)}>
                        <AiOutlineDelete size={20} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </StyledTableCell>
              </div>
              {value.industries.map((val, index3) => <div key={index3}>
                <div style={{ ...listStyle, marginLeft: '40px' }}>
                  <p>{val.name}</p>
                  <StyledTableCell sx={{ padding: 0, margin: 0, textDecoration: 'none', border: "none" }} align="right">
                    <Stack sx={{ padding: 0, margin: 0, textDecoration: 'none', border: "none" }} justifyContent={"end"}>
                      <Tooltip title="View">
                        <IconButton sx={{ color: "#ffffff", textDecoration: 'none', border: "none" }} onClick={() => handleShowViewPage(value?.customID)}>
                          <RiEditBoxLine size={20} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton sx={{ color: "#ffffff", textDecoration: 'none', border: "none" }} onClick={() => handleShowEditModal(val?.customID)}>
                          <BiEdit size={20} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton sx={{ color: "#ffffff", border: "none" }} onClick={() => handleShowDeleteModal(val?.customID)}>
                          <AiOutlineDelete size={20} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </StyledTableCell>
                </div>
              </div>)}
            </div>)}
          </div>)}
        </div>
      </Grid>
      {/* Upload  */}
      <Modal
        isShowModal={uploadMediaModal}
        title={"Upload Industry Details"}
        handleCloseModal={uploadMediaHideModal}
        width={"1200px"}
      >
        <UploadMedia
          handleCancel={uploadMediaHideModal}
          handleUploadSubmit={handleUploadSubmit}
        />
      </Modal>
      {/* Select */}
      <Modal
        isShowModal={editShow}
        title={editShow ? "Edit Nav Bar" : "Add Nav Bar"}
        handleCloseModal={manageHideModal}
        width={"900px"}
      >
        <MediaList
          handleCancel={manageHideModal}
          handleFormSubmit={handleFormSubmit}
          isEditModal={editShow}
          id={editShowId}
          fetchPath={"industry"}
        />
      </Modal>
      <DeleteAlertModal
        isOpen={deleteShow}
        modifyText={"Industry Navbar Deleted"}
        handleAlertClose={handleHideDelete}
        handleAlertAction={handleDeleteAction}
      />
    </Box>
  );
}

export default IndustryListPage;
