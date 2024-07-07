import {
  Avatar,
  Box,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { red } from "@mui/material/colors";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import SubmitButton from "../../Form/SubmitButton";
import FileUpload from "../../Form/FileUpload/FileUpload";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { imageCloseIconStyle } from "../../CustomStyle/OthersStyle";
import { FaTimes } from "react-icons/fa";
import CustomButton from "../../Button/CustomButton";
import Modal from "../Modal";
import MediaAllList from "../../Media/List/MediaCustList";
import ImageVideoModalItem from "../../Table/ImageVideo/ImageVideoModalItem";
import { toast } from "react-toastify";
import { getApiHandler } from "../../../lib/axios/ApiHelper";
import SpinnerLoading from "../../Skeleton/Spinner/SpinnerLoading";

// Validation Form
const validationSchema = Yup.object().shape({
  companyName: Yup.string().required("Company Name is required"),
  cid: Yup.string().required("CID is required"),
});

function CustomerMediaList({
  isEditModal,
  handleFormSubmit,
  handleCancel,
  id,
  fetchPath,
  isShowButtonText,
}) {
  const IMG_URL = "https://api.neemsah.com";
  //const IMG_URL = "http://localhost:5500";
  //const IMG_URL = import.meta.env.VITE_REACT_APP_API_URL;  
  const [isShowMediaModal, setIsShowMediaModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storeSelectedAttachment, setStoreSelectedAttachment] = useState([]);

  // react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      buttonText: "",
    },
  });

  // Show Upload modal
  const uploadMediaShowModal = () => {
    setIsShowMediaModal(true);
  };

  // Hide Upload modal
  const uploadMediaHideModal = () => {
    setIsShowMediaModal(false);
  };

  // Select attachments submit
  const handleAttachmentsSubmit = (e, selectedAttachment) => {
    e.preventDefault();
    uploadMediaHideModal();
    setStoreSelectedAttachment((prev) => [...prev, ...selectedAttachment]);
  };

  // Selected delete
  const handleSelectedDelete = (selectId) => {
    setStoreSelectedAttachment(
      storeSelectedAttachment?.filter((item) => item._id !== selectId)
    );
  };

  // Get single media attachments
  const getSingleItem = async () => {
    setIsLoading(true);
    const res = await getApiHandler(`/admin/${fetchPath}/single/${id}`);
    if (res?.success) {
      const { companyName, cid, description, images } = res?.data;
      setValue("companyName", companyName);
      setValue("cid", cid);
      setValue("description", description);
      setStoreSelectedAttachment(images);
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data not found");
      } else {
        toast.warn("Something went wrong");
      }
    }
    setIsLoading(false);
  };

  // Get single facilities attachments
  const getSingleFacilitiesItem = async () => {
    setIsLoading(true);
    const res = await getApiHandler(`/admin/${fetchPath}/single/${id}`);
    if (res?.success) {
      const { companyName, cid, description, images } = res?.data?.service[0];
      setValue("companyName", companyName);
      setValue("cid", cid);
      setValue("description", description);
      setStoreSelectedAttachment(images);
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data not found");
      } else {
        toast.warn("Something went wrong");
      }
    }
    setIsLoading(false);
  };

  const companyNameValue = watch("companyName", "");

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const date = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');

    const cid = `${companyNameValue.replace(/ /g, '-').toUpperCase()}-${year}${date}${month}`;
    setValue("cid", cid);
  }, [companyNameValue, setValue]);

  useEffect(() => {
    if (isEditModal && !isShowButtonText) {
      getSingleItem();
    } else if (isEditModal && isShowButtonText) {
      getSingleFacilitiesItem();
    }
  }, [id]);

  return (
    <>
      <Box
        component={"form"}
        onSubmit={handleSubmit((data) =>
          handleFormSubmit(data, storeSelectedAttachment)
        )}
      >
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <Controller
              render={({ field, formState }) => (
                <FormControl fullWidth variant="outlined">
                  <Typography
                    variant="formLabel"
                    color={!!formState.errors?.companyName ? red[700] : ""}
                  >
                    Company Name
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.companyName}
                    placeholder="Company Name"
                  />
                  {!!formState.errors?.companyName ? (
                    <FormHelperText error>
                      {errors?.companyName?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="companyName"
              control={control}
              defaultValue=""
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <Controller
              render={({ field, formState }) => (
                <FormControl fullWidth variant="outlined">
                  <Typography
                    variant="formLabel"
                    color={!!formState.errors?.cid ? red[700] : ""}
                  >
                    CID (YY-DD-MM)
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.cid}
                    placeholder="CID"
                  />
                  {!!formState.errors?.cid ? (
                    <FormHelperText error>
                      {errors?.cid?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="cid"
              control={control}
              defaultValue=""
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <Controller
              render={({ field, formState }) => (
                <FormControl fullWidth variant="outlined">
                  <Typography
                    variant="formLabel"
                    color={!!formState.errors?.description ? red[700] : ""}
                  >
                    Description
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.description}
                    placeholder="Description"
                  />
                  {!!formState.errors?.description ? (
                    <FormHelperText error>
                      {errors?.description?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="description"
              control={control}
              defaultValue=""
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mt: 3, mb: 6, textAlign: "center" }}>
              <CustomButton
                text={"Select Image"}
                variant={"outlined"}
                onClick={uploadMediaShowModal}
              />
            </Box>
            {isLoading ? (
              <SpinnerLoading />
            ) : (
              <Grid container spacing={2}>
                {storeSelectedAttachment?.length > 0
                  ? storeSelectedAttachment?.map((item, index) => {
                    return (
                      <Grid item lg={2} sm={3} xs={4} key={item?._id}>
                        {/* <Avatar
                          alt={item?.caption}
                          src={`${IMG_URL}/${item?.path}`}
                          variant="rounded"
                          sx={{
                            width: 1,
                            height: 150,
                            }}
                            handleDelete={handleSelectedDelete}
                        /> */}
                        <ImageVideoModalItem
                            type={item?.type}
                            path={`${item?.path}`}
                            altText={item?.caption}
                            item={item}
                            handleDelete={handleSelectedDelete}
                          />
                        {/* <ImageVideoModalItem
                          type={item?.type}
                          src={`${IMG_URL}/${item?.path}`}
                          // path={item?.path}
                          altText={item?.caption}
                          item={item}
                          handleDelete={handleSelectedDelete}
                        /> */}
                      </Grid>
                    );
                  })
                  : isEditModal && (
                    <Typography variant="formTitle" align="center" width={1}>
                      No image select yet{" "}
                    </Typography>
                  )}
              </Grid>
            )}
          </Grid>
        </Grid>
        <SubmitButton
          onCancelClick={handleCancel}
          submitBtnText={isEditModal ? "Update" : "Save"}
        />
      </Box>
      {/* All Media  */}
      <Modal
        isShowModal={isShowMediaModal}
        title={"Select Attachments"}
        handleCloseModal={uploadMediaHideModal}
        width={"1200px"}
      >
        <MediaAllList
          handleCancel={uploadMediaHideModal}
          handleAttachmentsSubmit={handleAttachmentsSubmit}
          attachmentType="image"
          previousSelectedImage={storeSelectedAttachment?.map(
            (item) => item?._id
          )}
        />
      </Modal>
    </>
  );
}

CustomerMediaList.defaultProps = {
  fetchPath: "customers",
  isShowButtonText: false,
};

export default CustomerMediaList
