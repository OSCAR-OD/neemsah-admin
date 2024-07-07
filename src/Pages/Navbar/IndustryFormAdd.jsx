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
import { Link } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { toast } from "react-toastify";
import StarFormLabel from "../../Components/Form/StarFormLabel"
import DeleteAlertModal from "../../Components/Alert/DeleteAlertModal";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../Components/CustomStyle/table/TableStyle";
import ErrorMessage from "../../Components/Error/ErrorMessage";
import Modal from "../../Components/Modal/Modal";
import DataNotFoundTable from "../../Components/NotFound/DataNotFoundTable";
import PageHeader from "../../Components/PageHeader/PageHeader";
import TableSkeleton from "../../Components/Skeleton/Table/TableSkeleton";
import {
  CustomTabPanel,
  a11yProps,
} from "../../Components/Tab/HeaderTabCommon";
import ImageVideoItem from "../../Components/Table/ImageVideo/ImageVideoItem";
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
import SubmitButton from "../../Components/Form/SubmitButton";
import BlogManageModal from "../../Components/Modal/Blog/BlogManageModal";
import GalleryPage from "../../Components/Gallery/GalleryPage";
import IndustriesForm from "../../Components/NavForm/IndustriesForm";
import UploadMedia from "../Media/UploadMedia";
import IndForm from "../../Components/NavForm/IndForm";
const tabHeaderData = [
  { id: 1, label: "Industry List", type: "ticket" },
];

function IndustryFormAdd() {
  const [tabValue, setTabValue] = useState(0);
  const [{ isLoading, isError, errorMessage, fetchData }, dispatch] =
    useReducer(fetchReducer, initialFetchData);
  const [
    { addShow, editShow, editShowId, deleteShow, deleteId },
    dispatchUser] = useReducer(userActionReducer, initialAction);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [uploadMediaModal, setUploadMediaModal] = useState(false);

  const uploadMediaShowModal = () => {
     setUploadMediaModal(true);
    };
  
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleShowEditModal = (id) => {
    const editFormatId = id;
    dispatchUser({ type: "EDIT/SHOW", editFormatId });
  };

  const handleShowDeleteModal = (id) => {
    const deleteFormatId = id;
    dispatchUser({ type: "DELETE/SHOW", deleteFormatId });
  };

  const handleHideDeleteModal = () => {
    dispatchUser({ type: "DELETE/HIDE" });
  };

    const handleDeleteAction = async () => {
    const res = await deleteApiHandler(`/admin/ticket/delete/${deleteId}`);
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

  const getFetchList = async () => {
    dispatch({ type: "LOADING" });
    const res = await getApiHandler("/admin/ticket/all");
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
          {row?.service ? (
            <Box sx={{ maxWidth: 110, p: 0 }}>{row?.service}</Box>
          ) : (
            "N/A"
          )}
        </StyledTableCell>
        <StyledTableCell>
          {row?.name ? (
            <Box sx={{ maxWidth: 260 }}>{row?.name}</Box>
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
            <Box sx={{ maxWidth: 260 }}>{row?.phone}</Box>
          ) : (
            "N/A"
          )}
        </StyledTableCell>
        <StyledTableCell>
          {row?.company ? (
            <Box sx={{ maxWidth: 260 }}>{row?.company}</Box>
          ) : (
            "N/A"
          )}
        </StyledTableCell>
        <StyledTableCell>
          {row?.serial ? (
            <Box sx={{ maxWidth: 100 }}>{row?.serial}</Box>
          ) : (
            "N/A"
          )}
        </StyledTableCell>
        <StyledTableCell>
          {row?.description ? (
            <Box sx={{ maxWidth: 100 }}>{row?.description}</Box>
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
   {/* <IndustriesForm /> */}
   <IndForm />
   {/* <UploadMedia /> */}
    </Box>
  );
}

export default IndustryFormAdd;
