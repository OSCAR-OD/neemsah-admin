import { useEffect, useState, useRef } from "react";
import { getApiHandler, postApiHandler, deleteApiHandler } from "../../lib/axios/ApiHelper";
import { useAuth } from "../../Context/Auth/UseAuth";
import useWindowDimensions from "../../Hooks/Theme/useWindowDimensions";
import { Avatar, Box, CircularProgress, Grid } from "@mui/material";
import PageHeader from "../../Components/PageHeader/PageHeader";
import Modal from "../../Components/Modal/Modal";
import MediaDetails from "./MediaDetails";
import UploadMedia from "./UploadMedia";
import MediaSkeleton from "../../Components/Skeleton/Media/MediaSkeleton";
import DataNotFound from "../../Components/NotFound/DataNotFound";
import ErrorMessage from "../../Components/Error/ErrorMessage";
import DeleteAlertModal from "../../Components/Alert/DeleteAlertModal";
import CustomButton from "../../Components/Button/CustomButton";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import { isVideoType } from "../../utils/GlobalUses/CommonUses";

function MediaList() {
  const IMG_URL = "https://api.neemsah.com";
  const [uploadMediaData, setUploadMediaData] = useState([]);
  const [storeSelectedData, setStoreSelectedData] = useState(null);
  const [uploadMediaModal, setUploadMediaModal] = useState(false);
  const [attachmentInfoModal, setAttachmentInfoModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ isError: false, message: null });
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isShowLoadBtn, setIsShowLoadBtn] = useState(true);
  const [mediaLimit, setMediaLimit] = useState(30);

  const { token } = useAuth();
  const { width } = useWindowDimensions();
  const isInitialMount = useRef(true);

  const uploadMediaShowModal = () => {
    setUploadMediaModal(true);
  };

  const uploadMediaHideModal = () => {
    setUploadMediaModal(false);
  };

  const attachmentsShowModal = (id) => {
    setStoreSelectedData(id);
    setAttachmentInfoModal(true);
  };

  const attachmentsHideModal = () => {
    setAttachmentInfoModal(false);
  };

  const handleDelete = () => {
    setDeleteModal(true);
  };

  const handleAlertClose = () => {
    setDeleteModal(false);
  };

  const handleAlertAction = async () => {
    const res = await deleteApiHandler(`/admin/files/delete/${storeSelectedData}`);
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

  const handleUploadSubmit = async (data, uploadFiles) => {
    if (uploadFiles?.length > 0) {
      const formData = new FormData();
      formData.append("caption", data?.mainTitle || "");
      formData.append("description", data?.description || "");
      formData.append("type", uploadFiles[0]?.file?.type?.includes("video") ? "video" : "image");
      formData.append("files", uploadFiles[0]?.file);
      const res = await postApiHandler(`/admin/files/upload`, formData);

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
    formData.append("caption", data?.title);
    formData.append("description", data?.description);
    formData.append("files", files[0]);
    const res = await postApiHandler(`/admin/files/edit/${storeSelectedData}`, formData);

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

  const handlePagination = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const getMedia = async () => {
    setLoading(true);
    const res = await getApiHandler("/admin/files/all", {
      page: currentPage,
      size: mediaLimit,
    });
    if (res?.success) {
      if (res?.data?.total === res?.data?.end) {
        setIsShowLoadBtn(false);
      }
      setUploadMediaData((prev) => [...prev, ...res?.data?.data]);
    } else {
      if (res?.response?.status === 404) {
        setErrorMessage({ isError: true, message: "Data Not Found" });
      } else {
        setErrorMessage({ isError: true, message: null });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      getMedia();
    }
  }, [shouldFetch, currentPage]);

  useEffect(() => {
    if (width >= 1500) {
      setMediaLimit(30);
    } else if (width >= 1200 && width <= 1499) {
      setMediaLimit(24);
    } else if (width >= 900 && width <= 1199) {
      setMediaLimit(18);
    } else if (width >= 600 && width <= 899) {
      setMediaLimit(15);
    } else if (width <= 599) {
      setMediaLimit(12);
    }
  }, [width]);

  let contentRender;
  if (loading && uploadMediaData?.length <= 0) {
    contentRender = <MediaSkeleton />;
  } else if (errorMessage?.isError) {
    return <ErrorMessage message={errorMessage?.message} />;
  } else if (uploadMediaData?.length <= 0) {
    contentRender = <DataNotFound />;
  } else if (uploadMediaData?.length > 0) {
    contentRender = (
      <>
        <Grid container columns={{ xl: 20, lg: 16, md: 15, sm: 12, xs: 12 }} spacing={2}>
          {uploadMediaData?.map((item, index) => {
            return (
              <Grid item lg={2} sm={3} xs={4} key={item?._id + index} sx={{ position: "relative" }}>
                <Avatar
                  alt={item?.caption}
                  src={`${IMG_URL}/${item?.path}`}
                  variant="rounded"
                  sx={{
                    width: 1,
                    height: 150,
                    cursor: "pointer",
                    border: "1px solid #d7d7d7",
                    "&:hover": { opacity: 0.8 },
                  }}
                  onClick={() => attachmentsShowModal(item?.customID)}
                />
                {item?.type === isVideoType && (
                  <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                    <AiOutlinePlayCircle size={34} color="#4fb5e5" />
                  </Box>
                )}
              </Grid>
            );
          })}
        </Grid>
        {loading && uploadMediaData?.length > 0 && (
          <Grid item xs={12}>
            <Box sx={{ mt: 3 }}>
              <MediaSkeleton />
            </Box>
          </Grid>
        )}
        {isShowLoadBtn && (
          <Box sx={{ textAlign: "center", mt: 6, mb: 10 }}>
            <CustomButton
              text={"Load More"}
              onClick={handlePagination}
              isDisabled={loading && uploadMediaData?.length > 0}
              isEndIcon={loading && uploadMediaData?.length > 0}
              icon={<CircularProgress color="secondary" size={16} />}
            />
          </Box>
        )}
      </>
    );
  }

  return (
    <Box>
      <PageHeader title={"Add New Media"} handleAddClick={uploadMediaShowModal} />
      <Box sx={{ mt: 3 }}>{contentRender}</Box>

      <Modal isShowModal={uploadMediaModal} title={"Upload Media"} handleCloseModal={uploadMediaHideModal} width={"1200px"}>
        <UploadMedia handleCancel={uploadMediaHideModal} handleUploadSubmit={handleUploadSubmit} />
      </Modal>

      <Modal isShowModal={attachmentInfoModal} title={"Attachment details"} handleCloseModal={attachmentsHideModal} width={"1200px"}>
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
    </Box>
  );
}

export default MediaList;
