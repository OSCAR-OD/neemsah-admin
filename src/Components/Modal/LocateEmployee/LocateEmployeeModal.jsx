import {
  Avatar,
  Button,
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
import MediaAllList from "../../Media/MediaAllList";
import ImageVideoModalItem from "../../Table/ImageVideo/ImageVideoModalItem";
import { toast } from "react-toastify";
import { getApiHandler } from "../../../lib/axios/ApiHelper";
import SpinnerLoading from "../../Skeleton/Spinner/SpinnerLoading";
//Validation Form
const validationSchema = Yup.object().shape({
  countryName: Yup.string().required("Country Name is required"),
  countryCode: Yup.string().required("Country Name is required"),
  employeeName: Yup.string().required("Country Name is required"),
  email: Yup.string().required("Country Name is required"),
  phone: Yup.string().required("Country Name is required"),
  address: Yup.string().required("Country Name is required"),
});
function LocateEmployeeModal({
  isEditModal,
  handleFormSubmit,
  handleCancel,
  id,
  fetchPath,
  isShowButtonText,
}) {
  const [isShowMediaModal, setIsShowMediaModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //const [storeSelectedAttachment, setStoreSelectedAttachment] = useState([]);
  // console.log("storeSelectedAttachment:", storeSelectedAttachment);
  //react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      buttonText: "",
    },
  });

  //?All Media Modal
  //Show Upload modal
  const uploadMediaShowModal = () => {
    setIsShowMediaModal(true);
  };
  //Hide Upload modal
  const uploadMediaHideModal = () => {
    setIsShowMediaModal(false);
  };

  //Select attachments submit
  // const handleAttachmentsSubmit = (e, selectedAttachment) => {
  const handleAttachmentsSubmit = (e) => {

    e.preventDefault();
    // console.log(
    //   "handleAttachmentsSubmit - selectedAttachment:",
    //   selectedAttachment
    // );
    uploadMediaHideModal();
    //setStoreSelectedAttachment((prev) => [...prev, ...selectedAttachment]);
  };

  //Selected delete
  const handleSelectedDelete = (selectId) => {
    //console.log("handleSelectedDelete - selectId:", selectId);
    // setStoreSelectedAttachment(
    //   storeSelectedAttachment?.filter((item) => item._id !== selectId)
    // );
  };

  //Get single media attachments
  const getSingleItem = async () => {
    setIsLoading(true);
    const res = await getApiHandler(`/admin/${fetchPath}/single/${id}`);
    //console.log("getSingleMedia - res:", res?.data);
    if (res?.success) {
      const { title, btnLink, description, images } = res?.data;
      setValue("mainTitle", title);
      setValue("buttonLink", btnLink);
      setValue("description", description);
      // setStoreSelectedAttachment(images);
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data not found");
      } else {
        toast.warn("Something went wrong");
      }
    }
    setIsLoading(false);
  };

  //Get single facilites attachments
  const getSingleFacilitiesItem = async () => {
    setIsLoading(true);
    const res = await getApiHandler(`/admin/${fetchPath}/single/${id}`);
    //console.log("getSingleMedia - res:", res?.data);
    if (res?.success) {
      const { title, btnText, btnLink, description, images } =
        res?.data?.service[0];
      setValue("mainTitle", title);
      setValue("buttonText", btnText);
      setValue("buttonLink", btnLink);
      setValue("description", description);
      // setStoreSelectedAttachment(images);
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data not found");
      } else {
        toast.warn("Something went wrong");
      }
    }
    setIsLoading(false);
  };

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
          handleFormSubmit(data)
          // handleFormSubmit(data, storeSelectedAttachment)
        )}
      >
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <Controller
              render={({ field, formState }) => (
                <FormControl fullWidth variant="outlined">
                  <Typography
                    variant="formLabel"
                    color={!!formState.errors?.countryName ? red[700] : ""}
                  >
                    Country Name
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.countryName}
                    placeholder="Country Name"
                  />
                  {!!formState.errors?.countryName ? (
                    <FormHelperText error>
                      {errors?.countryName?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="countryName"
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
                    color={!!formState.errors?.countryCode ? red[700] : ""}
                  >
                    Country Code
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.countryCode}
                    placeholder="countryCode"
                  />
                  {!!formState.errors?.countryCode ? (
                    <FormHelperText error>
                      {errors?.countryCode?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="countryCode"
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
                    color={!!formState.errors?.employeeName ? red[700] : ""}
                  >
                    Employee Name
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.employeeName}
                    placeholder="employeeName"
                  />
                  {!!formState.errors?.employeeName ? (
                    <FormHelperText error>
                      {errors?.employeeName?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="employeeName"
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
                    color={!!formState.errors?.email ? red[700] : ""}
                  >
                    Email
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.email}
                    placeholder="Email"
                  />
                  {!!formState.errors?.email ? (
                    <FormHelperText error>
                      {errors?.email?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="email"
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
                    color={!!formState.errors?.phone ? red[700] : ""}
                  >
                    Phone
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.phone}
                    placeholder="Phone"
                  />
                  {!!formState.errors?.phone ? (
                    <FormHelperText error>
                      {errors?.phone?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="phone"
              control={control}
              defaultValue=""
            />
          </Grid>
          {isShowButtonText && (
            <Grid item sm={6} xs={12}>
              <Controller
                render={({ field, formState }) => (
                  <FormControl fullWidth variant="outlined">
                    <Typography
                      variant="formLabel"
                      color={!!formState.errors?.buttonText ? red[700] : ""}
                    >
                      Button Text
                    </Typography>
                    <TextField
                      {...field}
                      error={!!formState.errors?.buttonText}
                      placeholder="Button Text"
                    />
                    {!!formState.errors?.buttonText ? (
                      <FormHelperText error>
                        {errors?.buttonText?.message}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                )}
                name="buttonText"
                control={control}
                defaultValue=""
              />
            </Grid>
          )}
          <Grid item sm={6} xs={12}>
            <Controller
              render={({ field, formState }) => (
                <FormControl fullWidth variant="outlined">
                  <Typography
                    variant="formLabel"
                    color={!!formState.errors?.address ? red[700] : ""}
                  >
                    Address
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.address}
                    placeholder="Address"
                  />
                  {!!formState.errors?.address ? (
                    <FormHelperText error>
                      {errors?.address?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="address"
              control={control}
              defaultValue=""
            />
          </Grid>
        </Grid>
        <SubmitButton
          onCancelClick={handleCancel}
          submitBtnText={isEditModal ? "Update" : "Save"}
        />
      </Box>
      {/* All Media  */}
      {/* <Modal
        isShowModal={isShowMediaModal}
        title={"Select Attachments"}
        handleCloseModal={uploadMediaHideModal}
        width={"1200px"}
      > */}
      {/* <MediaAllList
          handleCancel={uploadMediaHideModal}
          handleAttachmentsSubmit={handleAttachmentsSubmit}
          attachmentType="image"
          // previousSelectedImage={storeSelectedAttachment?.map(
          //   (item) => item?._id
          // )}
        /> */}
      {/* </Modal> */}
    </>
  );
}

LocateEmployeeModal.defaultProps = {
  fetchPath: "locate-employee",
  isShowButtonText: false,
};

export default LocateEmployeeModal;
