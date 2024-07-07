import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography
} from "@mui/material";
import { red } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { getApiHandler } from "../../../lib/axios/ApiHelper";
import CustomButton from "../../Button/CustomButton";
import SubmitButton from "../../Form/SubmitButton";
import MediaAllList from "../../Media/MediaAllList";
import SpinnerLoading from "../../Skeleton/Spinner/SpinnerLoading";
import ImageVideoModalItem from "../../Table/ImageVideo/ImageVideoModalItem";
import Modal from "../Modal";

//Validation Form
const validationSchema = Yup.object().shape({
  mainTitle: Yup.string().required("Title is required"),
  totalCapacity: Yup.number()
    .integer("Please enter numbers")
    .nullable()
    .typeError("Enter a number"),
  settingCapacity: Yup.number()
    .integer("Please enter numbers")
    .nullable()
    .typeError("Enter a number"),
  description: Yup.string().required("Description is required"),
  buttonLink: Yup.string().url("Enter valid url").nullable(),
});

function FeaturesManageModal({
  isEditModal,
  handleFormSubmit,
  handleCancel,
  isEventPlan,
  id,
  singleFetchPath,
  isMultiple,
  attachmentSelect,
}) {
  const [isShowMediaModal, setIsShowMediaModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storeSelectedAttachment, setStoreSelectedAttachment] = useState([]);

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
  });
 // console.log("errors:", errors);
  //?All Media Modal
  //Show Upload modal
  const uploadMediaShowModal = () => {
    setIsShowMediaModal(true);
  };
  //Hide Upload modal
  const uploadMediaHideModal = () => {
    setIsShowMediaModal(false);
  };

  //Selected delete
  const handleSelectedDelete = (selectId) => {
    setStoreSelectedAttachment(
      storeSelectedAttachment?.filter((item) => item._id !== selectId)
    );
  };

  //Select attachments submit
  const handleAttachmentsSubmit = (e, selectedAttachment) => {
    e.preventDefault();
    uploadMediaHideModal();
    if (isMultiple) {
      setStoreSelectedAttachment((prev) => [...prev, ...selectedAttachment]);
    } else {
      setStoreSelectedAttachment(selectedAttachment);
    }
  };

  //Get single media attachments
  const getSingleItem = async () => {
    setIsLoading(true);
    const res = await getApiHandler(`/admin/${singleFetchPath}/single/${id}`);
    if (res?.success) {
     // console.log("getSingleItem - res:", res);
      const {
        title,
        btnLink,
        totalCapacity,
        settingCapacity,
        description,
        image,
        images,
        floating,
        seating,
      } = res?.data;
    //  console.log("getSingleItem - floating:", floating);
      setValue("mainTitle", title);
      setValue("totalCapacity", totalCapacity || floating);
      setValue("settingCapacity", settingCapacity || seating);
      setValue("buttonLink", btnLink);
      setValue("description", description);
      setStoreSelectedAttachment(isMultiple ? images : [image]);
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
    if (isEditModal) {
      getSingleItem();
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
                    color={!!formState.errors?.mainTitle ? red[700] : ""}
                  >
                    Title
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.mainTitle}
                    placeholder="Main Title"
                  />
                  {!!formState.errors?.mainTitle ? (
                    <FormHelperText error>
                      {errors?.mainTitle?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="mainTitle"
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
                    color={!!formState.errors?.buttonLink ? red[700] : ""}
                  >
                    Button Link
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.buttonLink}
                    placeholder="Button Link"
                  />
                  {!!formState.errors?.buttonLink ? (
                    <FormHelperText error>
                      {errors?.buttonLink?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="buttonLink"
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
                    color={!!formState.errors?.totalCapacity ? red[700] : ""}
                  >
                    {isEventPlan ? "Floating Capacity" : "Total Capacity"}
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.totalCapacity}
                    placeholder={
                      isEventPlan ? "Floating Capacity" : "Total Capacity"
                    }
                    type="number"
                  />
                  {!!formState.errors?.totalCapacity ? (
                    <FormHelperText error>
                      {errors?.totalCapacity?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="totalCapacity"
              control={control}
              defaultValue={0}
            />
          </Grid>

          <Grid item sm={6} xs={12}>
            <Controller
              render={({ field, formState }) => (
                <FormControl fullWidth variant="outlined">
                  <Typography
                    variant="formLabel"
                    color={!!formState.errors?.settingCapacity ? red[700] : ""}
                  >
                    Seating Capacity
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.settingCapacity}
                    placeholder="Seating Capacity"
                    type="number"
                  />
                  {!!formState.errors?.settingCapacity ? (
                    <FormHelperText error>
                      {errors?.settingCapacity?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="settingCapacity"
              control={control}
              defaultValue={0}
            />
          </Grid>

          <Grid item xs={12}>
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
                    multiline
                    minRows={4}
                    maxRows={12}
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
          selectType={attachmentSelect}
          previousSelectedImage={storeSelectedAttachment?.map(
            (item) => item?._id
          )}
        />
      </Modal>
    </>
  );
}

FeaturesManageModal.defaultProps = {
  singleFetchPath: "",
  isMultiple: true,
  isEventPlan: false,
  attachmentSelect: 0,
};

export default FeaturesManageModal;
