import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Box,
  Typography,
  FormControl,
  TextField,
  FormHelperText,
  IconButton,
  Modal,
  Alert,
  AlertTitle,
  Paper,
  Grid,
  Stack,
  Divider,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { getApiHandler, postApiHandler } from "../../../lib/axios/ApiHelper";
import { useDropzone } from "react-dropzone";
import { FaTimes } from "react-icons/fa";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

const SingleIndustryPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [heroImage, setHeroImage] = useState("");
  const [heroPreview, setHeroPreview] = useState("");
  const [processImages, setProcessImages] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUploadIndex, setCurrentUploadIndex] = useState(null);
  const [industryID, setIndustryID] = useState(null);
  const steps = ["Hero", "Industry", "Process", "Reference"];

  const validationSchema = Yup.object().shape({
    // Add any required validations here
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const { fields: processFields, append: appendProcess, remove: removeProcess } = useFieldArray({
    control,
    name: "processes",
  });

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: { "image/*": [], "video/*": [] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      const newFiles = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      if (currentUploadIndex === "hero") {
        setHeroPreview(newFiles[0].preview);
        setHeroImage(newFiles[0].file);
      } else {
        setProcessImages((prevImages) => ({
          ...prevImages,
          [currentUploadIndex]: newFiles[0],
        }));
      }
      setIsModalOpen(false);
    },
    maxFiles: 1,
  });

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(heroPreview);
      Object.values(processImages).forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [heroPreview, processImages]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getApiHandler(`/admin/industry/getIndustryData`);
      if (res?.success) {
        const { hero, processes } = res.data;
        setHeroPreview(hero.image);
        reset({
          name: hero.name,
          description: hero.description,
          processes: processes.map((process) => ({
            title: process.title,
            description: process.description,
            prImage: process.image,
          })),
        });
      }
    };
    fetchData();
  }, [reset]);

  const handleAddProcess = () => {
    appendProcess({ title: "", description: "", prImage: "" });
  };

  const handleImageUpload = (index) => {
    setCurrentUploadIndex(index);
    setIsModalOpen(true);
  };

  const handleUploadSubmit = async (data, section) => {
    const formData = new FormData();
    formData.append("industryID", industryID);

    if (section === "hero" && heroImage) {
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("file", heroImage);
    } else if (section === "process") {
      data.processes.forEach((process, index) => {
        formData.append(`processes[${index}][title]`, process.title);
        formData.append(`processes[${index}][description]`, process.description);
        if (processImages[index]?.file) {
          formData.append(`processes[${index}][image]`, processImages[index].file);
        }
      });
    }

    const res = await postApiHandler(`/admin/industry/addIndustryPage`, formData);
    if (res?.success) {
      toast.success("Data saved successfully");
    } else {
      toast.error("Something went wrong");
    }
  };

  const onSubmit = (data, section) => {
    handleUploadSubmit(data, section);
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  useEffect(() => {
    const url = window.location.pathname.split('/');
    const id = url[url.length - 1];
    setIndustryID(id);
  }, []);

  return (
    <Paper sx={{ maxWidth: 1150, width: 1, mx: "auto", py: { sm: 3, xs: 2 }, px: { sm: 3, xs: 1 } }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Industry Page</Typography>
        {activeStep === 0 && (
          <>
            <Box sx={{ mb: 3, mt: 4, display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h5">Hero Section</Typography>
              <Button variant="contained" onClick={() => handleImageUpload("hero")}>
                Upload Image
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Avatar src={heroPreview} variant="square" alt="Image" sx={{ width: 200, height: 100 }} />
            </Box>
            <form onSubmit={handleSubmit((data) => onSubmit(data, "hero"))}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Name" variant="outlined" error={!!errors.name} />
                  )}
                />
                {errors.name && <FormHelperText error>{errors.name.message}</FormHelperText>}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      variant="outlined"
                      error={!!errors.description}
                      multiline
                      rows={4}
                    />
                  )}
                />
                {errors.description && <FormHelperText error>{errors.description.message}</FormHelperText>}
              </FormControl>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" color="primary" type="submit">
                  Save
                </Button>
              </Box>
            </form>
          </>
        )}
        {activeStep === 2 && (
          <Box sx={{ mb: 3, mt: 7 }}>
            <Grid container spacing={2}>
              <Grid item sm={3} xs={5}>
                <Typography variant="formTitle">Processes</Typography>
              </Grid>
              <Grid item sm={4} xs={7}>
                <Typography variant="formTitle">Title</Typography>
              </Grid>
              <Grid item sm={4} xs={10}>
                <Typography variant="formTitle">Description</Typography>
              </Grid>
              <Grid item sm={1} xs={1}>
                <Typography variant="formTitle">Action</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ mt: 1, mb: 3 }} />
            <form onSubmit={handleSubmit((data) => onSubmit(data, "process"))}>
            {processFields.map((item, index) => (
              <Grid container spacing={2} alignItems={"center"} sx={{ mb: 1 }} key={index}>
                <Grid item sm={3} xs={5}>
                  <Stack justifyContent={"space-between"} gap={1}>
                    <Avatar
                      src={processImages[index]?.preview || getValues(`processes.${index}.prImage`)}
                      variant="square"
                      alt="image"
                      sx={{ width: 60, height: 60 }}
                    />
                    <Button
                      sx={{ width: "fit-content", fontSize: 11, fontWeight: 700 }}
                      onClick={() => handleImageUpload(index)}
                    >
                      Upload Image
                    </Button>
                  </Stack>
                </Grid>
                <Grid item sm={4} xs={7}>
                  <Controller
                    name={`processes.${index}.title`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Title"
                        variant="outlined"
                        error={!!errors?.processes?.[index]?.title}
                        sx={{ width: "100%" }}
                      />
                    )}
                  />
                  <FormHelperText error={!!errors?.processes?.[index]?.title}>
                    {errors?.processes?.[index]?.title?.message}
                  </FormHelperText>
                </Grid>
                <Grid item sm={4} xs={10}>
                  <Controller
                    name={`processes.${index}.description`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Description"
                        variant="outlined"
                        multiline
                        rows={2}
                        error={!!errors?.processes?.[index]?.description}
                        sx={{ width: "100%" }}
                      />
                    )}
                  />
                  <FormHelperText error={!!errors?.processes?.[index]?.description}>
                    {errors?.processes?.[index]?.description?.message}
                  </FormHelperText>
                </Grid>
                <Grid item sm={1} xs={1}>
                  <IconButton color="primary" onClick={() => removeProcess(index)}>
                    <FaTimes />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button onClick={handleAddProcess}>Add Process</Button>
            <Box sx={{ mt: 3 }}>
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
            </Box>
            </form>
          </Box>
        )}
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button onClick={handleNext}>
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </Box>
      </Box>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Upload Image</Typography>
            <Box {...getRootProps({ className: "dropzone" })} sx={{ border: "2px dashed #eaeaea", p: 3, mt: 2 }}>
              <input {...getInputProps()} />
              <Typography align="center">Drag 'n' drop some files here, or click to select files</Typography>
            </Box>
            {fileRejections.length > 0 && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <AlertTitle>Error</AlertTitle>
                {fileRejections.map(({ errors }) => errors.map((e) => <Typography key={e.code}>{e.message}</Typography>))}
              </Alert>
            )}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button variant="outlined" onClick={() => setIsModalOpen(false)} sx={{ mr: 2 }}>
                Cancel
              </Button>
            </Box>
          </Paper>
        </Box>
      </Modal>
    </Paper>
  );
};

export default SingleIndustryPage;
