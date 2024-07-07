import {
  Avatar,
  Box,
  Divider,
  FormControl,
  Grid,
  IconButton,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import SubmitButton from "../../../Components/Form/SubmitButton";
import { AiOutlineDelete } from "react-icons/ai";
import { useEffect, useState } from "react";
import imgTEst from "/assets/images/no-image-availabe.png";
import { getApiHandler } from "../../../lib/axios/ApiHelper";
import { useAuth } from "../../../Context/Auth/UseAuth";
import DeleteAlertModal from "../../../Components/Alert/DeleteAlertModal";
import ErrorMessage from "../../../Components/Error/ErrorMessage";
import { isVideoType } from "../../../utils/GlobalUses/CommonUses";
import moment from "moment/moment";
import FileUpload from "../../../Components/Form/FileUpload/FileUpload";

//Validation Form
const validationSchema = Yup.object().shape({
  //title: Yup.string(),
  // altText: Yup.string(),
});

function MediaDetails({
  handleAttachmentSubmit,
  handleCancel,
  id,
  deleteModal,
  handleDelete,
  handleAlertClose,
  handleAlertAction,
}) {
    const IMG_URL = "https://api.neemsah.com";
    //const IMG_URL = "http://localhost:5500";
    //const IMG_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    isError: false,
    message: null,
  });
  const [files, setFiles] = useState([]);

  //Context
  const { token } = useAuth();

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

  //Cancel file
  const handleCancelFile = (cancelFile) => {
    setFiles(files?.filter((item) => item?.name !== cancelFile.name));
  };

  //submit attachments
  const onSubmit = (formData) => {
    handleAttachmentSubmit(formData, files);
  };

  //Get single media attachments
  const getMedia = async () => {
    setLoading(true);
    const res = await getApiHandler(`/admin/home/exhibitionCard/single/${id}`);
    //console.log("res", res);
    if (res?.success) {
      setImageData(res?.data);
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
    getMedia();
  }, [id]);

  //Set input value
  useEffect(() => {
    if (imageData) {
      setValue("title", imageData.title || "");
      setValue("division", imageData.division || "");
      setValue("date", imageData.date || "");
      setValue("headline", imageData.headline || "");
      setValue("description", imageData.description || "");
    }
  }, [imageData]);
  if (errorMessage?.isError) {
    return <ErrorMessage message={errorMessage?.message} />;
  }

  return (
    <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: 1,
            }}
          >
            <Typography
              variant="h4"
              fontSize={18}
              align="start"
              width={1}
              mb={1}
            >
              Upload new attachment{" "}
            </Typography>
            <FileUpload
              showFile={files}
              handleSetFile={setFiles}
              maximumFile={1}
              handleCancelFile={handleCancelFile}
            />
            <Box sx={{ width: 1, textAlign: "start", mt: 3 }}>
              <Typography
                variant="h4"
                fontSize={18}
                align="start"
                width={1}
                mb={1}
              >
                Previous attachment:{" "}
              </Typography>
              {loading ? (
                <Skeleton width={150} height={150} />
              ) : (
                <>
                  {imageData?.type === isVideoType ? (
                    <Box
                      component={"video"}
                      src={`${IMG_URL}/${imageData?.path}`}
                      sx={{ maxHeight: 500, maxWidth: 1, objectFit: "cover" }}
                    ></Box>
                  ) : (
                    <Avatar
                    src={`${IMG_URL}/${imageData?.path}`}
                      alt={imageData?.title || "N/A"}
                      variant="square"
                      sx={{ width: 150, height: 150 }}
                    />
                  )}
                </>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box>
            <Box>
              <Typography variant="formTitle" fontWeight={400}>
                Attachment Info:
              </Typography>
              <Box
                component={"ul"}
                sx={{
                  pl: 2,
                  li: {
                    fontSize: 14,
                    mb: 0.5,
                  },
                }}
              >
                {loading ? (
                  <>
                    <Skeleton width={"80%"} height={20} />
                    <Skeleton width={"70%"} height={20} />
                    <Skeleton width={"60%"} height={20} />
                    <Skeleton width={"40%"} height={20} />
                  </>
                ) : (
                  <>
                    <Box component={"li"}>
                      Uploaded on:{" "}
                      {moment(imageData?.updatedAt).format(
                        "DD, MMMM YYYY - hh:mm a"
                      )}{" "}
                    </Box>
                    <Box component={"li"}>
                      File name: {imageData?.path || "N/A"}{" "}
                    </Box>
                    <Box component={"li"}>
                      File type: {imageData?.type || "N/A"}{" "}
                    </Box>
                  </>
                )}
              </Box>
            </Box>
            <Divider sx={{ mt: 2 }} />
            <Box>
              <Controller render={({ field, formState }) => (
                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                  <Typography
                    variant="formLabel"
                    color={!!formState.errors?.title ? red[700] : ""}
                  >
                    Exhibition Card Title
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.title}
                    placeholder="Exhibition Card Title"
                  />
                  {!!formState.errors?.title ? (
                    <FormHelperText error>
                      {errors?.title?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
                name="title"
                control={control}
                defaultValue=""
              />
              <Controller render={({ field, formState }) => (
                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                  <Typography
                    variant="formLabel"
                    color={!!formState.errors?.division ? red[700] : ""}
                  >
                    Exhibition Card Division
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.division}
                    placeholder="Exhibition Card Division"
                  />
                  {!!formState.errors?.division ? (
                    <FormHelperText error>
                      {errors?.division?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
                name="division"
                control={control}
                defaultValue=""
              />
              <Controller render={({ field, formState }) => (
                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                  <Typography
                    variant="formLabel"
                    color={!!formState.errors?.date ? red[700] : ""}
                  >
                    Exhibition Card Date
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.date}
                    placeholder="Exhibition Card Date"
                  />
                  {!!formState.errors?.date ? (
                    <FormHelperText error>
                      {errors?.date?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
                name="date"
                control={control}
                defaultValue=""
              />
              <Controller render={({ field, formState }) => (
                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                  <Typography
                    variant="formLabel"
                    color={!!formState.errors?.headline ? red[700] : ""}
                  >
                    Exhibition Card Headline
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.headline}
                    placeholder="Exhibition Card Headline"
                    multiline
                    minRows={3}
                    maxRows={10}
                  />
                  {!!formState.errors?.headline ? (
                    <FormHelperText error>
                      {errors?.headline?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
                name="headline"
                control={control}
                defaultValue=""
              />
              <Controller render={({ field, formState }) => (
                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                  <Typography
                    variant="formLabel"
                    color={!!formState.errors?.description ? red[700] : ""}
                  >
                    Exhibition Card Description
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.description}
                    placeholder="Exhibition Card Description"
                    multiline
                    minRows={3}
                    maxRows={10}
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
            </Box>
            <Divider sx={{ mt: 2 }} />
            <Box sx={{ mt: 1 }}>
              <Typography variant="formTitle" fontWeight={400}>
                Action:
              </Typography>
              <Tooltip title="Delete">
                <IconButton onClick={handleDelete}>
                  <AiOutlineDelete />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <SubmitButton
        horizontalAlignment={"end"}
        submitBtnText={"Save"}
        onCancelClick={handleCancel}
      />
      {/* Delete Modal  */}
      <DeleteAlertModal
        isOpen={deleteModal}
        handleAlertAction={handleAlertAction}
        handleAlertClose={handleAlertClose}
        modifyText={"this attachment"}
      />
    </Box>
  );
}

export default MediaDetails;
