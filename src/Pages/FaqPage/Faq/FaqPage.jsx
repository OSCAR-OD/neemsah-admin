import {
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
import SpaFaqManageModal from "../../../Components/Modal/Faq/SpaFaqManageModal";
import Modal from "../../../Components/Modal/Modal";
import DataNotFoundTable from "../../../Components/NotFound/DataNotFoundTable";
import PageHeader from "../../../Components/PageHeader/PageHeader";
import TableSkeleton from "../../../Components/Skeleton/Table/TableSkeleton";
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

function FaqPage() {
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
    handleShowEditModal();
    // dispatchUser({ type: "ADD/SHOW" });
  };
  //Hide Upload modal
  const manageHideModal = () => {
    dispatchUser({ type: "ADD/EDIT/HIDE" });
  };

  //Show edit modal
  const handleShowEditModal = (id) => {
   // console.log("handleShowEditModal - id:", id);
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
    const res = await deleteApiHandler(`/admin/faq/delete/${deleteId}`);
    if (res?.success) {
      handleHideDeleteModal();
      toast.success("Faq All List Deleted");
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
    // console.log(
    //   selectedAttachment,
    //   "handleFormSubmit - data:",
    //   data,
    //   data?.ritualsList?.length,
    //   selectedAttachment?.length,
    //   (data?.ritualsList?.length > 0 ? true : false) &&
    //     data?.selectedAttachment?.length > 0
    //     ? true
    //     : false
    // );
    if (data?.ritualsList?.length > 0 && selectedAttachment?.length > 0) {
      const formatImage = selectedAttachment?.map((row) => row?._id);
      const formatList = data?.ritualsList?.map((row) => {
        return { question: row?.question, answer: row?.answer };
      });
      //console.log("handleFormSubmit - formatList:", formatList);
      const res = await postApiHandler(
        fetchData?.length > 0
          ? `/admin/faq/edit/${editShowId}`
          : `/admin/faq/add`,
        {
          faq: formatList,
          image: formatImage.toString(),
        }
      );

      if (res?.success) {
        manageHideModal();
        setShouldFetch((prev) => !prev);
        toast.success(editShow ? "Faq List Updated" : "Faq List Added");
      } else {
        if (res?.response?.status === 404) {
          toast.warn("Data not found");
        } else {
          toast.warn("Something went wrong");
        }
      }
    } else {
      if (selectedAttachment?.length <= 0) {
        toast.info("Please select a attachment");
      } else if (data?.ritualsList?.length <= 0) {
        toast.info("Please enter a faq list");
      } else {
        toast.info("Please enter a faq list and select one attachment");
      }
    }
  };

  //Get all list
  const getFetchList = async () => {
    dispatch({ type: "LOADING" });
    const res = await getApiHandler("/admin/faq/all");
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
    //console.log("call effect");

    getFetchList();
  }, [shouldFetch]);

  //Condition Render
  let contentRender;

  if (isLoading) {
    contentRender = <TableSkeleton numberOfTitle={1} />;
  } else if (isError) {
    return <ErrorMessage message={errorMessage} />;
  } else if ( fetchData?.length <= 0) {
    contentRender = <DataNotFoundTable column={5} />;
  } else if (fetchData?.length > 0) {
    contentRender = fetchData[0]?.faq?.map((row, index) => (
      <StyledTableRow key={row?._id} sx={{ verticalAlign: "top" }}>
        <StyledTableCell component="th" scope="row">
          {index + 1}
        </StyledTableCell>

        <StyledTableCell>
          {" "}
          <Box sx={{ maxWidth: 170 }}>{row?.question || "N/A"}</Box>{" "}
        </StyledTableCell>

        <StyledTableCell>
          {row?.answer ? (
            <Box sx={{ maxWidth: 200 }}>{row?.answer}</Box>
          ) : (
            "N/A"
          )}
        </StyledTableCell>
        {index === 0 && (
          <>
            <StyledTableCell rowSpan={fetchData[0]?.faq?.length + 1}>
              <Stack gap={1}>
                {fetchData[0]?.image || fetchData[0]?.image?.length > 0 ? (
                  <ImageVideoItem
                    type={fetchData[0]?.image?.type}
                    path={fetchData[0]?.image?.path}
                    altText={fetchData[0]?.description}
                  />
                ) : (
                  "N/A"
                )}
              </Stack>
            </StyledTableCell>
            <StyledTableCell
              align="right"
              rowSpan={fetchData[0]?.faq?.length + 1}
            >
              <Stack justifyContent={"end"}>
                <Tooltip title="Edit">
                  <IconButton
                    onClick={() => handleShowEditModal(fetchData[0]?.customID)}
                  >
                    <BiEdit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    onClick={() =>
                      handleShowDeleteModal(fetchData[0]?.customID)
                    }
                  >
                    <AiOutlineDelete />
                  </IconButton>
                </Tooltip>
              </Stack>
            </StyledTableCell>
          </>
        )}
      </StyledTableRow>
    ));
  }

  return (
    <Box>
      <PageHeader
        title={"Faq List"}
        handleAddClick={() => handleShowEditModal(fetchData[0]?.customID)}
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
              <StyledTableCell>Question</StyledTableCell>
              <StyledTableCell>Answear</StyledTableCell>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{contentRender}</TableBody>
        </Table>
      </TableContainer>

      {/* Mange  Modal  */}
      <Modal
        isShowModal={addShow || editShow}
        title={"Manage Faq List "}
        handleCloseModal={manageHideModal}
        width={"900px"}
      >
        <SpaFaqManageModal
          handleCancel={manageHideModal}
          handleFormSubmit={handleFormSubmit}
          isEditModal={true}
          id={editShowId}
          singleFetchPath={"faq"}
        />
      </Modal>

      {/*  Delete Modal  */}
      <DeleteAlertModal
        isOpen={deleteShow}
        modifyText={"faq all  list"}
        handleAlertClose={handleHideDeleteModal}
        handleAlertAction={handleDeleteAction}
      />
    </Box>
  );
}

export default FaqPage;
