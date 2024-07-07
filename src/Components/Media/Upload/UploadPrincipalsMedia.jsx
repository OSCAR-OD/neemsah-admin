import {
  Alert,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SubmitButton from "../../Form/SubmitButton";
import { FaTimes } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { red } from "@mui/material/colors";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { AiOutlinePlayCircle } from "react-icons/ai";

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

//Validation Form
const validationSchema = Yup.object().shape({
  // mainTitle: Yup.string(),
  // description: Yup.string(),
});

function UploadPrincipalsMedia({ handleCancel, handleUploadSubmit }) {
  const [files, setFiles] = useState([]);
  //console.log("UploadPrincipalsMedia - files:", files);
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      "image/*": [],
      "video/*": [],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        return;
      }
      const newFiles = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    },
    maxFiles: 20, 
  });

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

  //Cancel file
  const handleCancelFile = (cancelFile) => {
    //console.log("handleCancelFile - cancelFile:", cancelFile);
    setFiles(
      files?.filter((item) => item?.file?.name !== cancelFile?.file?.name)
    );
  };

  //submit media
  const onSubmit = (data) => {
    handleUploadSubmit(data, files);
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
  }, [files]);

  return (
    <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <Box
        {...getRootProps({ className: "dropzone" })}
        sx={{
          height: 300,
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
        <p>Drag n drop some files here, or click to select files</p>
        <em style={{ fontSize: "14px" }}>
          (Only upload images and videos files upload){" "}
        </em>
        <Button variant="outlined">Select File</Button>
      </Box>
      <aside style={thumbsContainer}>
        {thumbs}
        <div>{fileRejectionItems}</div>
      </aside>
      <Grid container spacing={2} sx={{ mt: 3 }}>
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
      </Grid>
      <SubmitButton submitBtnText={"Upload"} onCancelClick={handleCancel} />
    </Box>
  );
}

export default UploadPrincipalsMedia;
