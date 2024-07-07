import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tooltip,
} from "@mui/material";
import { useEffect, useReducer, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { toast } from "react-toastify";
import DeleteAlertModal from "../../../Components/Alert/DeleteAlertModal";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../Components/CustomStyle/table/TableStyle";
import ErrorMessage from "../../../Components/Error/ErrorMessage";
import Modal from "../../../Components/Modal/Modal";
import DataNotFoundTable from "../../../Components/NotFound/DataNotFoundTable";
import PageHeader from "../../../Components/PageHeader/PageHeader";
import TableSkeleton from "../../../Components/Skeleton/Table/TableSkeleton";
import {
  CustomTabPanel,
  a11yProps,
} from "../../../Components/Tab/HeaderTabCommon";
import ImageVideoItem from "../../../Components/Table/ImageVideo/ImageVideoItem";
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
//import axios from 'axios';
//Tab Header
const tabHeaderData = [
  { id: 1, label: "Contact Form List", type: "contact" },
 ];

function ContactsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [{ isLoading, isError, errorMessage, fetchData }, dispatch] =
    useReducer(fetchReducer, initialFetchData);
  const [
    { addShow, editShow, editShowId, deleteShow, deleteId },
    dispatchUser,
  ] = useReducer(userActionReducer, initialAction);
  const [shouldFetch, setShouldFetch] = useState(false);

  //Tab selection
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
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

  //Delete function
  const handleDeleteAction = async () => {
    const res = await deleteApiHandler(`/admin/contact/delete/${deleteId}`);
    if (res?.success) {
      handleHideDeleteModal();
      toast.success("Form List Deleted");
      setShouldFetch((prev) => !prev);
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data Not Found");
      } else {
        toast.warn("Something went wrong");
      }
    }
  };

  //Get all list
  const getFetchList = async () => {
    dispatch({ type: "LOADING" });
    const res = await getApiHandler("/admin/contact/all");
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
  }, [shouldFetch, tabValue]);

  //Condition Render
  let contentRender;

  if (isLoading) {
    contentRender = (
      <TableSkeleton numberOfTitle={3} isShowImage={false} numberOfAction={1} />
    );
  } else if (isError) {
    return <ErrorMessage message={errorMessage} />;
  } else if (fetchData?.length <= 0) {
    contentRender = <DataNotFoundTable column={6} />;
  } else if (fetchData?.length > 0) {
    contentRender = fetchData?.map((row, index) => (
      <StyledTableRow key={row?._id}>
        <StyledTableCell component="th" scope="row">
          {index + 1}
        </StyledTableCell>
        <StyledTableCell>
        {row?.name ? (
            <Box sx={{ maxWidth: 110, p: 0 }}>{row?.name}</Box>
          ) : (
            "N/A"
          )}
        </StyledTableCell>
        <StyledTableCell>
          {" "}
          <Button
            LinkComponent={"a"}
            href={`mailto:${row?.email}`}
            sx={{ maxWidth: 120, p: 0 }}
          >
            {row?.email || "N/A"}
          </Button>
        </StyledTableCell>
        <StyledTableCell>
          {row?.phone ? (
            <Box sx={{ maxWidth: 100 }}>{row?.phone}</Box>
          ) : (
            "N/A"
          )}
        </StyledTableCell>
        <StyledTableCell>
          {row?.description ? (
            <Box sx={{ maxWidth: 260 }}>{row?.description}</Box>
          ) : (
            "N/A"
          )}
        </StyledTableCell>
        <StyledTableCell align="right">
          <Stack justifyContent={"end"}>
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
      {/* <PageHeader title={"Testimonial List"} handleAddClick={manageShowModal} /> */}
      <Box sx={{ width: "100%", mt: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            aria-label="basic tabs example"
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabHeaderData?.map((item, index) => (
              <Tab label={item?.label} {...a11yProps(index)} />
            ))}
          </Tabs>
        </Box>
        <TableContainer component={Paper} sx={{ mt: 3, maxHeight: 700 }}>
          <Table
            sx={{ minWidth: 700 }}
            aria-label="customized table"
            size="small"
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <StyledTableCell>#SI</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Phone</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell align="right">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>{contentRender}</TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/*  Delete Modal  */}
      <DeleteAlertModal
        isOpen={deleteShow}
        modifyText={`${tabHeaderData[tabValue]?.type} form list`}
        handleAlertClose={handleHideDeleteModal}
        handleAlertAction={handleDeleteAction}
      />
    </Box>
  );
}

export default ContactsPage;
