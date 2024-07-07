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
import React, { useState } from "react";
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

//Validation Form
const validationSchema = Yup.object().shape({
  mainTitle: Yup.string(),
  subTitle: Yup.string(),
  description: Yup.string(),
});

function TestimonialManageModal({
  isEditModal,
  handleFormSubmit,
  handleCancel,
  id,
}) {
  const [uploadMediaData, setuploadMediaData] = useState([
    {
      id: 1,
      image: "/assets/images/no-image-availabe.png",
      isVideos: true,
    },
    {
      id: 2,
      image: "/assets/images/no-image-availabe.png",
    },
    {
      id: 1,
      image: "/assets/images/no-image-availabe.png",
      isVideos: true,
    },
    {
      id: 2,
      image: "/assets/images/no-image-availabe.png",
    },
    {
      id: 1,
      image: "/assets/images/no-image-availabe.png",
      isVideos: true,
    },
    {
      id: 2,
      image: "/assets/images/no-image-availabe.png",
    },
  ]);
  const [isShowMediaModal, setIsShowMediaModal] = useState(false);

  //react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
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

  return (
    <>
      <Box component={"form"} onSubmit={handleSubmit(handleFormSubmit)}>
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
                    color={!!formState.errors?.subTitle ? red[700] : ""}
                  >
                    Sub Title
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.subTitle}
                    placeholder="Sub Title"
                  />
                  {!!formState.errors?.subTitle ? (
                    <FormHelperText error>
                      {errors?.subTitle?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="subTitle"
              control={control}
              defaultValue=""
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
            <Grid container spacing={2}>
              {uploadMediaData?.map((item, index) => {
                return (
                  <Grid item lg={2} sm={3} xs={4} key={index}>
                    <Box sx={{ position: "relative" }}>
                      <Avatar
                        alt="Upload image"
                        src={item?.image}
                        variant="rounded"
                        sx={{
                          width: 1,
                          height: 100,
                        }}
                      />
                      {item?.isVideos && (
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
                      )}
                      <IconButton sx={imageCloseIconStyle}>
                        <FaTimes size={14} color="black" />
                      </IconButton>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
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
        <MediaAllList handleCancel={uploadMediaHideModal} />
      </Modal>
    </>
  );
}

export default TestimonialManageModal;
