import {
  Avatar,
  Box,
  Grid,
  Typography,
  Button,
  FormControl,
  TextField,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getApiHandler } from "../../../lib/axios/ApiHelper";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import SpinnerLoading from "../../Skeleton/Spinner/SpinnerLoading";
import SubmitButton from "../../Form/SubmitButton";
import { useAuth } from "../../../Context/Auth/UseAuth";
import { useDropzone } from "react-dropzone";
import { FaTimes } from "react-icons/fa";
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
};

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  position: "relative",
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

function ViewRfqModal({
  isViewModal,
  handleFormSubmit,
  isEditMood,
  handleCancel,
  id,
  fetchPath,
}) {
  const IMG_URL = "https://api.neemsah.com";
  //const IMG_URL = "http://localhost:5500";
  //const IMG_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [rfqData, setRfqData] = useState(null);
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      "image/*": [],
      "video/*": [],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        return;
      }
      const newFiles = acceptedFiles.map((file) => {
        return {
          file,
          preview: URL.createObjectURL(file),
        };
      });
      setFiles([...files.concat(newFiles)]);
    },
    maxFiles: 1,
  });
  //react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    // resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  // Get single RFQ data
  const getSingleItem = async () => {
    setIsLoading(true);
    const res = await getApiHandler(`/admin/${fetchPath}/viewSingleRFQ/${id}`);
    if (res?.success) {
      setRfqData(res?.data);
      setValue("claimedBy", user?.name);
      setValue("status", 'In Progress');
      setValue("comments", res?.data?.comments);
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data not found");
      } else {
        toast.warn("Something went wrong");
      }
    }
    setIsLoading(false);
  };
  //console.log("rfqData.path", `${IMG_URL}/${rfqData?.path}`);
  //submit media
  const onSubmit = (data) => {
    handleSubmit(data, files);
  };

  //Cancel file
  const handleCancelFile = (cancelFile) => {
    //console.log("handleCancelFile - cancelFile:", cancelFile);
    setFiles(
      files?.filter((item) => item?.file?.name !== cancelFile?.file?.name)
    );
  };

  //File Preview
  const thumbs = files?.map((file) => {
    return (
      <div style={thumb} key={file?.file.name}>
        <div style={thumbInner}>
          {file?.file?.type?.includes("video") ? (
            <video src={file.preview} controls={false}></video>
          ) : (
            <img
              src={file?.preview}
              style={img}
              // Revoke data uri after image is loaded
              onLoad={() => {
                URL.revokeObjectURL(file.preview);
              }}
            />
          )}

          <IconButton
            sx={{
              position: "absolute",
              right: "2px",
              top: "2px",
              background: "white",
            }}
            onClick={() => handleCancelFile(file)}
          >
            <FaTimes size={16} color="black" />
          </IconButton>
        </div>
      </div>
    );
  });
  //File Rejection
  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <Box key={file.path}>
      <Alert severity="warning" sx={{ mt: 1 }}>
        <AlertTitle>
          File: {file.path} - {file.size} bytes
        </AlertTitle>
      </Alert>
      <Box>
        {errors.map((e) => (
          <Alert severity="info" key={e.code} sx={{ mt: 1, ml: 2 }}>
            <AlertTitle>
              {e.message} maximum {1} upload{" "}
            </AlertTitle>
          </Alert>
        ))}
      </Box>
    </Box>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  useEffect(() => {
    if (isViewModal || isEditMood) {
      getSingleItem();
    }
  }, [id]);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (!rfqData) {
    return null;
  }

  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit((data) =>
        handleFormSubmit(
          data,
          files
        )
      )}
    >
      <Grid container spacing={2}>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Customer</Typography>
          <Typography>{rfqData.companyName}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Creation Date (MM-DD-YYYY)</Typography>
          <Typography>{formatDate(rfqData.createdAt)}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Project</Typography>
          <Typography>{rfqData.projectName}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Deadline (MM-DD-YYYY)</Typography>
          <Typography>{rfqData.deadline}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Application</Typography>
          <Typography>{rfqData.application}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Person Contact</Typography>
          <Typography>{rfqData.personContact}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Flag Type</Typography>
          <Typography>{rfqData.flags}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Created By</Typography>
          <Typography>{rfqData.createdBy}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Assigned To</Typography>
          <Typography>{rfqData.claimedBy || "N/A"}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Status</Typography>
            {!rfqData.claimedBy &&
              <Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={handleSubmit((data) =>
                handleFormSubmit(
                  data,
                  files
                )
              )}>Claim This RFQ</Button>
            }
          </Box>
          {rfqData.status || "Open"} {rfqData.claimedBy ? `(${rfqData.claimedBy})` : ""}
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>RFQ Type</Typography>
          <Typography>{rfqData.rfqType || "N/A"}</Typography>
        </Grid>
        <Grid item xs={12}>
          {rfqData.rsvpData && (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>RSVP Data</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Title: {rfqData.rsvpData.title}</Typography>
              {/* <Typography>Description: {rfqData.rsvpData.description}</Typography> */}
              {rfqData.rsvpData.sections.map((section, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {/* Section:  */}
                    {section.title}</Typography>
                  {section.questions.map((question, qIndex) => (
                    <Box key={qIndex} sx={{ ml: 2 }}>
                      <Typography>{question.title} ({question.type}): {question.value}</Typography>
                    </Box>
                  ))}
                </Box>
              ))}
            </Grid>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Machine Information</Typography>
          {rfqData?.machineInformation.map((machine, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{machine.title}</Typography>
              <Typography>Speed: {machine.speed}</Typography>
              <Typography>Filling Volume: {machine.fillingVolume}</Typography>
              <Typography>Filling Accuracy: {machine.fillingAccuracy}</Typography>
              <Typography>Foil Specification: {machine.foilSpecification}</Typography>
              <Typography>Packet Type: {machine.packetType}</Typography>
              <Typography>Remarks: {machine.remarks}</Typography>
            </Box>
          ))}
        </Grid>
        <Grid item xs={12}>
          {rfqData.status &&
            <Grid item sm={6} xs={12}>
              <Box
                {...getRootProps({ className: "dropzone" })}
                sx={{
                  height: 120,
                  border: "2px dotted #4FB5E5",
                  borderRadius: "5px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <input {...getInputProps()} />
                <p>Drag n drop files here, or click to select files</p>
                <em style={{ fontSize: "14px" }}>
                  (Only upload image files){" "}
                </em>
                <Button variant="outlined">Select File</Button>
              </Box>
              <aside style={thumbsContainer}>
                {thumbs}
                <div>{fileRejectionItems}</div>
              </aside>
            </Grid>
          }
          {rfqData.path &&
          <Grid item xs={12}>
            <Avatar
              alt={rfqData?.companyName || "N/A"}
              src={`${IMG_URL}/${rfqData?.path}`}
              variant="square"
              sx={{ width: 150, height: 150 }}
            />
            </Grid>
          }
          {rfqData.status &&
            <Grid item sm={6} xs={12}>
              <Controller
                render={({ field, formState }) => (
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <Typography
                      variant="formLabel"
                      color={!!formState.errors?.comments ? red[700] : ""}
                    >
                      Comments
                    </Typography>
                    <TextField
                      {...field}
                      error={!!formState.errors?.comments}
                      placeholder="Comments"
                      multiline
                      minRows={2}
                      maxRows={6}
                    />
                    {!!formState.errors?.comments ? (
                      <FormHelperText error>
                        {errors?.comments?.message}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                )}
                name="comments"
                control={control}
                defaultValue=""
              />
            </Grid>
          }
        </Grid>
      </Grid>
      {rfqData.status &&
        <SubmitButton
          onCancelClick={handleCancel}
          submitBtnText={isEditMood ? "Update" : "Save"}
        />
      }
    </Box>
  );
}

ViewRfqModal.defaultProps = {
  fetchPath: "sales",
};

export default ViewRfqModal;
