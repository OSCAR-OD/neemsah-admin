import { Alert, AlertTitle, Box, Button, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDropzone } from "react-dropzone";

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

function FileUpload({
  handleSetFile,
  showFile,
  fileAccept,
  maximumFile,
  handleCancelFile,
  isEditFile,
  uploadMessage,
}) {
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: fileAccept,
    onDrop: (acceptedFiles) => {
      handleSetFile(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    maxFiles: maximumFile,
  });

  //File Preview
  const thumbs = showFile?.map((file) => {
   // console.log("thumbs - file:", file);
    return (
      <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          {file?.type?.includes("video") ? (
            <video src={file.preview} controls={false}></video>
          ) : file?.type?.includes("image") ? (
            <img
              src={file.preview}
              style={img}
              // Revoke data uri after image is loaded
              onLoad={() => {
                URL.revokeObjectURL(file.preview);
              }}
            />
          ) : (
            <Box
              component={"a"}
              target="_blank"
              href={file.preview}
              sx={{ maxWidth: 150 }}
            >
              {file?.name}
            </Box>
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
              {e.message} maximum {maximumFile} upload{" "}
            </AlertTitle>
          </Alert>
        ))}
      </Box>
    </Box>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => showFile?.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <Box sx={{ width: 1 }}>
      <Box
        {...getRootProps({ className: "dropzone" })}
        sx={{
          height: 200,
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
        <em style={{ fontSize: "14px" }}>{uploadMessage}</em>
        <Button variant="outlined">Select File</Button>
      </Box>
      <aside style={thumbsContainer}>
        {thumbs}
        <div>{fileRejectionItems}</div>
      </aside>
    </Box>
  );
}
FileUpload.defaultProps = {
  fileAccept: {
    "image/*": [],
    "video/*": [],
  },
  maximumFile: 10,
  uploadMessage: " (Only images and videos files upload)",
};
export default FileUpload;
