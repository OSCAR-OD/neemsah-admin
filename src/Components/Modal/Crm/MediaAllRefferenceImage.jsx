import { Avatar, Box, CircularProgress, Grid } from "@mui/material";
import React, { useEffect, useReducer, useState } from "react";
import SubmitButton from "../../Form/SubmitButton";
import { AiOutlinePlayCircle } from "react-icons/ai";
import CustomButton from "../../Button/CustomButton";
import { useForm } from "react-hook-form";
import AllMediaSkeleton from "../../Skeleton/Media/AllMediaSkeleton";
import {
  fetchReducer,
  getApiHandler,
  initialFetchData,
} from "../../../lib/axios/ApiHelper";
import ErrorMessage from "../../Error/ErrorMessage";
import DataNotFound from "../../NotFound/DataNotFound";
import { toast } from "react-toastify";
import useWindowDimensions from "../../../Hooks/Theme/useWindowDimensions";

function MediaAllRefferenceImage({
  handleCancel,
  handleAttachmentsSubmit,
  selectType,
  attachmentType,
  previousSelectedImage,
  singleFetchPath,
  isEditMood,
  id,
}) {
    //const IMG_URL = "https://api.neemsah.com";
    const IMG_URL = "http://localhost:5500";
    //const IMG_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const [{ isLoading, isError, errorMessage, fetchData }, dispatch] =
    useReducer(fetchReducer, initialFetchData);
  const [selectedAttachment, setSelectedAttachment] = useState([]);
  const [multipleSelectedAttachment, setMultipleSelectedAttachment] = useState(
    []
  );
  const [storeSelectedId, setStoreSelectedId] = useState(previousSelectedImage);
  const [currentPage, setCurrentPage] = useState(1);
  const [isShowLoadBtn, setIsShowLoadBtn] = useState(true);
  const [mediaLimit, setMediaLimit] = useState(30);
  // console.log(multipleSelectedAttachment, "storeSelectedId:", storeSelectedId);
  //Context

  const { width } = useWindowDimensions();


  //Attachments selected
  const handleSelectedImage = (item) => {
    const formatSelectAttachment = () => {
      if (selectType === 1) {
        setSelectedAttachment([item]);
        setStoreSelectedId([item?._id]);
      } else if (selectType === 0) {
        // console.log("handleSelectedImage - item:", item);
        if (storeSelectedId?.find((row) => row === item?._id)) {
          setStoreSelectedId(
            storeSelectedId?.filter((data) => data !== item?._id)
          );
          setMultipleSelectedAttachment(
            multipleSelectedAttachment?.filter(
              (data) => data?._id !== item?._id
            )
          );
        } else {
          setStoreSelectedId((prevValue) => [...prevValue, item?._id]);
          setMultipleSelectedAttachment((prevValue) => [...prevValue, item]);
        }
      }
    };

    if (item?.type === attachmentType) {
      formatSelectAttachment();
    } else if (attachmentType === "all") {
      formatSelectAttachment();
    } else {
      toast.info(`Only ${attachmentType} allow`);
    }
  };

  //react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
  });

    //Pagination
    const handlePagination = () => {
     // console.log("s");
  
      setCurrentPage((prev) => prev + 1);
    };

  //Get all media attachments
  const getMedia = async () => {
    dispatch({ type: "LOADING" });
    const res = await getApiHandler("/admin/industry/allRefferenceImage", {
      page: currentPage,
      size: mediaLimit,
    });
    if (res?.success) {
      const dataFormat = [...fetchData, ...res.data.data];
      dispatch({ type: "LOADED", dataFormat });
      if (res?.data?.total === res?.data?.end) {
        setIsShowLoadBtn(false);
      }
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

  //Get single media attachments
  const getSingleItem = async () => {
    const res = await getApiHandler(`/admin/${singleFetchPath}/single/${id}`);
    if (res?.success) {
     // console.log("getSingleItem - res:", res);
      if (res?.data?.images?.length > 0) {
        setStoreSelectedId(res?.data?.images?.map((item) => item?._id));
        if (selectType === 0) {
          setMultipleSelectedAttachment(res?.data?.images);
        } else {
          setSelectedAttachment(res?.data?.image);
        }
      }
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data not found");
      } else {
        toast.warn("Something went wrong");
      }
    }
  };

  useEffect(() => {
    if (isEditMood) {
      getSingleItem();
    }
  }, []);

  useEffect(() => {
    getMedia();
  }, [currentPage]);

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

  //Condition Render
  let contentRender;

  if (isLoading && fetchData?.length <= 0) {
    contentRender = <AllMediaSkeleton />;
  } else if (isError) {
    return <ErrorMessage message={errorMessage} />;
  } else if (fetchData?.length <= 0) {
    contentRender = <DataNotFound />;
  } else if (fetchData?.length > 0) {
    contentRender = (
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          {fetchData?.map((item, index) => {
            return (
              <Grid
                item
                lg={2}
                sm={3}
                xs={6}
                key={item?._id}
                sx={{ position: "relative" }}
              >
                {item?.type === "video" ? (
                  <>
                    <Box
                      component={"video"}
                      src={`${import.meta.env.VITE_APP_ATTACHMENT_URL}/${
                        item?.path
                      }`}
                      sx={{
                        width: 1,
                        height: 150,
                        cursor: "pointer",
                        border: storeSelectedId?.includes(item?._id)
                          ? "2px solid #4FB5E5"
                          : "",
                        "&:hover": {
                          opacity: 0.8,
                        },
                      }}
                      onClick={() => handleSelectedImage(item)}
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
                      <AiOutlinePlayCircle size={34} color="#4fb5e5" />{" "}
                    </Box>
                  </>
                ) : (
                  <Avatar
                    alt={item?.caption}
                    src={`${IMG_URL}/${item?.path}`}
                    variant="rounded"
                    sx={{
                      width: 1,
                      height: 150,
                      cursor: "pointer",
                      border: storeSelectedId?.includes(item?._id)
                        ? "2px solid #4FB5E5"
                        : "",
                      "&:hover": {
                        opacity: 0.8,
                      },
                    }}
                    onClick={() => handleSelectedImage(item)}
                  />
                )}
              </Grid>
            );
          })}
        </Grid>
        {/* <Box sx={{ mt: 6, textAlign: "center" }}>
          <CustomButton text={"Load More"} />
        </Box> */}
        {isLoading && fetchData?.length > 0 && (
            <Grid item xs={12}>
              <Box sx={{ mt: 3 }}>
                <AllMediaSkeleton />
              </Box>
            </Grid>
          )}
          {isShowLoadBtn && (
            <Box sx={{ textAlign: "center", mt: 6, mb: 10 }}>
              <CustomButton
                text={"Load More"}
                onClick={handlePagination}
                isDisabled={isLoading && fetchData?.length > 0 ? true : false}
                isEndIcon={isLoading && fetchData?.length > 0 ? true : false}
                icon={<CircularProgress color="secondary" size={16} />}
              />
            </Box>
          )}
      </Box>
    );
  }

  return (
    <Box
      component={"form"}
      onSubmit={(e) =>
        handleAttachmentsSubmit(
          e,
          selectType === 1 ? selectedAttachment : multipleSelectedAttachment
        )
      }
    >
      {contentRender}
      <SubmitButton onCancelClick={handleCancel} />
    </Box>
  );
}

MediaAllRefferenceImage.defaultProps = {
  selectType: 0,
  attachmentType: "all",
  previousSelectedImage: [],
  singleFetchPath: "",
};

export default MediaAllRefferenceImage;
