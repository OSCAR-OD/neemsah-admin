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
import MediaAllList from "../../Media/List/MediaPrinList";
import ImageVideoModalItem from "../../Table/ImageVideo/ImageVideoModalItem";
import { toast } from "react-toastify";
import { getApiHandler } from "../../../lib/axios/ApiHelper";
import SpinnerLoading from "../../Skeleton/Spinner/SpinnerLoading";

//Validation Form
const validationSchema = Yup.object().shape({
  // mainTitle: Yup.string().required("Title is required"),
  // description: Yup.string().required("Description is required"),
});
function PrincipalManageModal({
  isEditModal,
  handleFormSubmit,
  handleCancel,
  id,
  fetchPath,
  isShowButtonText,
}) {
  const [isShowMediaModal, setIsShowMediaModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storeSelectedAttachment, setStoreSelectedAttachment] = useState([]);
  //console.log("storeSelectedAttachment:", storeSelectedAttachment);

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
  const handleAttachmentsSubmit = (e, selectedAttachment) => {
    e.preventDefault();
    console.log("handleAttachmentsSubmit - selectedAttachment:", selectedAttachment);
    uploadMediaHideModal();
    setStoreSelectedAttachment((prev) => [...prev, ...selectedAttachment]);
  };

  //Selected delete
  const handleSelectedDelete = (selectId) => {
    console.log("handleSelectedDelete - selectId:", selectId);
    setStoreSelectedAttachment(
      storeSelectedAttachment?.filter((item) => item._id !== selectId)
    );
  };

  //Get single media attachments
  const getSingleItem = async () => {
    setIsLoading(true);
    const res = await getApiHandler(`/admin/${fetchPath}/single/${id}`);
    //console.log("getSingleMedia - res:", res?.data);
    if (res?.success) {
      const {  name, eventKey, images } = res?.data;
      setValue("name", name);
      setValue("eventKey", eventKey);
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

  //Get single facilites attachments
  const getSingleFacilitiesItem = async () => {
    setIsLoading(true);
    const res = await getApiHandler(`/admin/${fetchPath}/single/${id}`);
    //console.log("getSingleMedia - res:", res?.data);
    if (res?.success) {
      const { name, eventKey, images } =
        // res?.data?.service[0];
      setValue("name", name);
      setValue("eventKey", eventKey);
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
                    color={!!formState.errors?.name ? red[700] : ""}
                  >
                    Name
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.name}
                    placeholder="Name"
                  />
                  {!!formState.errors?.name ? (
                    <FormHelperText error>
                      {errors?.name?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="name"
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
                    color={!!formState.errors?.eventKey ? red[700] : ""}
                  >
                    Event Key
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.eventKey}
                    placeholder="Event Key"
                  />
                  {!!formState.errors?.eventKey ? (
                    <FormHelperText error>
                      {errors?.eventKey?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="eventKey"
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
                          <ImageVideoModalItem
                            type={item?.type}
                            path={item?.path}
                            altText={item?.caption}
                            item={item}
                            handleDelete={handleSelectedDelete}
                          />
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

PrincipalManageModal.defaultProps = {
  fetchPath: "principals",
  isShowButtonText: false,
};

export default PrincipalManageModal;
