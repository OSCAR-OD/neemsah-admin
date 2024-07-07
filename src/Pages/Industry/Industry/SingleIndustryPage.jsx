import React, { useEffect, useReducer, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PageHeader from "../../../Components/PageHeader/PageHeader";
import { red } from "@mui/material/colors";
import * as Yup from "yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import SubmitButton from "../../../Components/Form/SubmitButton";
import CustomButton from "../../../Components/Button/CustomButton";
import {
  initialAction,
  userActionReducer,
} from "../../../utils/Action/ManageUserAction";
import Modal from "../../../Components/Modal/Modal";
import { FaTimes } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { getApiHandler, postApiHandler } from "../../../lib/axios/ApiHelper";
import { toast } from "react-toastify";
import SpinnerLoading from "../../../Components/Skeleton/Spinner/SpinnerLoading";
import MediaAllRefferenceImage from "../../../Components/Modal/Crm/MediaAllRefferenceImage";
import UploadMedia from "../../../Components/Modal/Crm/UploadRefferenceImage";
//Validation Form
const validationSchema = Yup.object().shape({
  processStart: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
    })
  ),
  processEnd: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
    })
  ),
  processes: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required("title is required"),
      description: Yup.string().required("Description is required"),
    })
  ),
  refLayoutMachinePositions: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
    })
  ),

});

function SingleIndustryPage() {
  //const IMG_URL = "https://api.neemsah.com";
  const IMG_URL = "http://localhost:5500";
  //const IMG_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const [
    { addShow, editShow, editShowId, deleteShow, deleteId },
    dispatchUser,
  ] = useReducer(userActionReducer, initialAction);
  const [storeUploadImages, setStoreUploadImages] = useState({
    heroImage: null,
    industryImage: null,
    refLayoutImage: null,
    prImage: null,
    poImage: null,
    index: null,
    status: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditSettings, setIsEditSettings] = useState(true);
  const [settingsDataList, setSettingsDataList] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [industryID, setIndustryID] = useState(null);
  const [uploadMediaModal, setUploadMediaModal] = useState(false);

  //react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
    },
  });

  const { fields: processStartFields, append: appendProcessStart, remove: removeProcessStart } = useFieldArray({
    control,
    name: "processStart",
  });
  const { fields: processEndFields, append: appendProcessEnd, remove: removeProcessEnd } = useFieldArray({
    control,
    name: "processEnd",
  });
  const { fields: processFields, append: appendProcess, remove: removeProcess } = useFieldArray({
    control,
    name: "processes",
  });
  const { fields: refLayoutFields, append: appendRefLayout, remove: removeRefLayout } = useFieldArray({
    control,
    name: "refLayoutMachinePositions",
  });

  //Submit attachment form
  const handleAttachmentsSubmit = (e, selectedAttachment) => {
    e.preventDefault();
    uploadMediaHideModal();
    if (storeUploadImages?.status === "heroImage") {
      setStoreUploadImages({
        ...storeUploadImages,
        heroImage: selectedAttachment[0],
      });
    } else if (storeUploadImages?.status === "industryImage") {
      setStoreUploadImages({
        ...storeUploadImages,
        industryImage: selectedAttachment[0],
      });
    } else if (storeUploadImages?.status === "refLayoutImage") {
      setStoreUploadImages({
        ...storeUploadImages,
        refLayoutImage: selectedAttachment[0],
      });
    } else if (storeUploadImages?.status === "prImage") {
      setValue(
        `processes.${storeUploadImages?.index}.prImage`,
        selectedAttachment[0]
      );
    }
    else if (storeUploadImages?.status === "poImage") {
      setValue(
        `refLayoutMachinePositions.${storeUploadImages?.index}.poImage`,
        selectedAttachment[0]
      );
    }
  };
  //Submit file upload
  const handleUploadSubmit = async (data, uploadFiles) => {
    if (uploadFiles?.length > 0) {
      const formData = new FormData();
      formData.append("name", data?.name ? data?.name : "");
      formData.append("description", data?.description);
      formData.append("type", uploadFiles[0]?.file?.type?.includes("video") ? "video" : "image");
      formData.append("files", uploadFiles[0]?.file);
      const res = await postApiHandler(`/admin/industry/uploadRefferenceImage`, formData);
       if (res?.success) {
        uploadMediaHideModal();
        setShouldFetch((prev) => !prev);
        toast.success("Attachment Uploaded");
      } else {
        if (res?.response?.status === 404) {
          toast.warn("Record Not Found");
        } else {
          toast.warn("Something went wrong");
        }
      }
    } else {
      toast.info("Please upload attachment first");
    }
  };

  useEffect(() => {
    const url = window.location.pathname.split('/');
    const id = url[url.length - 1];
    setIndustryID(id);
  }, []);

  // Submit form
  const onSubmit = async (data) => {
    const formatProcessStart = data?.processStart?.map((item) => ({
      title: item?.title,
      description: item?.description,
    }));
    const formatProcessEnd = data?.processEnd?.map((item) => ({
      title: item?.title,
      description: item?.description,
    }));
    const formatProcesses = data?.processes?.map((item) => ({
      title: item?.title,
      prImage: item?.prImage?._id,
      description: item?.description,
    }));
    const formatrefLayoutMachineList = data?.refLayoutMachinePositions?.map((item) => {
      return {
        x: item?.x,
        y: item?.y,
        title: item?.title,
        description: item?.description,
        poImage: item?.poImage?._id,
      };
    });
    const res = await postApiHandler(
      isEditSettings
        ? `/admin/industry/editIndustryPage/${settingsDataList?.customID}`
        : `/admin/industry/addIndustryPage`,
      {
        industryID: industryID,
        heroImage:
          storeUploadImages?.heroImage?._id ||
          settingsDataList?.heroImage?._id ||
          "",
        heroTitle: data?.heroTitle || "",
        heroDescription: data?.heroDescription || "",
        industryImage:
          storeUploadImages?.industryImage?._id ||
          settingsDataList?.industryImage?._id ||
          "",
        industryDescription: data?.industryDescription || "",
        productionProcessTitle: data?.productionProcessTitle || "",
        productionProcessSubTitle: data?.productionProcessSubTitle || "",
        refLayoutImage:
          storeUploadImages?.refLayoutImage?._id ||
          settingsDataList?.refLayoutImage?._id ||
          "",
        refLayoutTitle: data?.refLayoutTitle || "",
        processStart: formatProcessStart[0] || {},
        processEnd: formatProcessEnd[0] || {},
        processes: formatProcesses || [],
        refLayoutMachinePositions: formatrefLayoutMachineList || [],
      },
      //console.log("data", formatrefLayoutMachineList),
    );
    //console.log('data', data);
    if (res?.success) {
      setShouldFetch((prev) => !prev);
      toast.success("Industry Page saved");
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data not found");
      } else {
        toast.warn("Something went wrong");
      }
    }
  };

  const uploadImageShowModal = () => {
    setUploadMediaModal(true);
  };

  //Select Image 
  const handleShowMediaModal = (type, index) => {
    dispatchUser({ type: "ADD/SHOW" });
    if (type === "prImage") {
      setStoreUploadImages({
        ...storeUploadImages,
        status: type,
        index: index,
      });
    } else if (type === "poImage") {
      setStoreUploadImages({
        ...storeUploadImages,
        status: type,
        index: index,
      });
    } else {
      setStoreUploadImages({ ...storeUploadImages, status: type });
    }
  };

  //Hide Upload modal
  const uploadMediaHideModal = () => {
    dispatchUser({ type: "ADD/EDIT/HIDE" });
    setStoreUploadImages({
      ...storeUploadImages,
      status: null,
      index: null,
    });
  };

  const uploadImageHideModal = () => {
    setUploadMediaModal(false);
  };

  const handleAddProcess = () => {
    appendProcess({ title: "", description: "", prImage: {} });
  };

  const handleAddRefLayout = () => {
    appendRefLayout({ x: "", y: "", title: "", description: "", poImage: {} });
  };

  //Get all media attachments
  const getMedia = async (id) => {
    setIsLoading(true);
    //const res = await getApiHandler(`/admin/industry/singleIndustryNav/${id}`);
    const resIndPage = await getApiHandler(`/admin/industry/singleIndustryPage/${id}`);

    if (resIndPage?.success) {
      const dataFormat = resIndPage.data[0];
      if (resIndPage?.data?.length > 0) {
        const {
          heroTitle,
          heroDescription,
          heroImage,
          industryImage,
          industryDescription,
          productionProcessTitle,
          productionProcessSubTitle,
          processStart,
          processEnd,
          refLayoutTitle,
          refLayoutImage,
          processes,
          refLayoutMachinePositions,
        } =
          dataFormat;
        setIsEditSettings(true);
        setSettingsDataList(dataFormat);
        setValue("heroTitle", heroTitle);
        setValue("heroDescription", heroDescription);
        setValue("industryDescription", industryDescription);
        setValue("productionProcessTitle", productionProcessTitle);
        setValue("productionProcessSubTitle", productionProcessSubTitle);
        setValue("productionProcessSubTitle", productionProcessSubTitle);
        setValue("processStart", processStart);
        setValue("processEnd", processEnd);
        setValue("refLayoutTitle", refLayoutTitle);
        setValue("processes", processes);
        setValue("refLayoutMachinePositions", refLayoutMachinePositions);
        setStoreUploadImages({
          ...storeUploadImages,
          logo: headerIcon,
          favIcon: favIcon,
        });
      } else {
        setSettingsDataList([]);
        setIsEditSettings(false);
      }
      setIsLoading(false);
    } else {
      if (resIndPage?.response?.status === 404) {
        toast.warn("Data not found");
      } else {
        toast.warn("Something went wrong");
      }
      setIsEditSettings(false);
      setSettingsDataList([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (industryID) {
      getMedia(industryID);
    }
  }, [industryID, shouldFetch]);

  return (
    <Paper
      sx={{
        maxWidth: 1150,
        width: 1,
        mx: "auto",
        py: { sm: 3, xs: 2 },
        px: { sm: 3, xs: 1 },
      }}
    >
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        {isLoading ? (
          <SpinnerLoading mt={8} />
        ) : (
          <>
            <Box sx={{ mb: 3, mt: 4 }}>
              <Stack justifyContent={"space-between"} flexWrap={"wrap"} gap={1}>
                <Typography variant="modalInnerTitle">Industry Name</Typography>
              </Stack>
              <Divider sx={{ mt: 1 }} />
            </Box>
            <Box sx={{ mb: 3, mt: 4 }}>
          <PageHeader title={"Hero Section"} handleAddClick={uploadImageShowModal} />
        </Box>
            <Box sx={{ mb: 3, mt: 4 }}>
              <Stack justifyContent={"space-between"} flexWrap={"wrap"} gap={1}>
                <Typography variant="modalInnerTitle">Hero Image</Typography>
                <CustomButton
                  text={"Select Image"}
                  variant={"outlined"}
                  onClick={() => handleShowMediaModal("heroImage")}
                />
              </Stack>
              <Divider sx={{ mt: 1 }} />
              <Stack justifyContent={"space-between"}
                flexWrap={"wrap"}
                gap={1}
                mt={2}
              >
                <Avatar
                  src={
                    storeUploadImages?.heroImage
                      ? `${IMG_URL}/${storeUploadImages?.heroImage?.path
                      }`
                      : "hi"
                  }
                  variant="square"
                  alt="Image"
                  sx={{
                    width: "auto",
                    height: "auto",
                    maxWidth: 200,
                    maxHeight: 100,
                    minWidth: 50,
                    minHeight: 50,
                  }}
                />
              </Stack>
            </Box>
          </>
        )}
        <Box sx={{ mb: 3 }}>
          <Controller render={({ field, formState }) => (
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <Typography
                variant="formLabel"
                color={!!formState.errors?.heroTitle ? red[700] : ""}
              >
                Hero Title
              </Typography>
              <TextField
                {...field}
                error={!!formState.errors?.heroTitle}
                placeholder="Hero Title"
                multiline
              />
              {!!formState.errors?.heroTitle ? (
                <FormHelperText error>
                  {errors?.heroTitle?.message}
                </FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          )}
            name="heroTitle"
            control={control}
            defaultValue=""
          />
          <Controller render={({ field, formState }) => (
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <Typography
                variant="formLabel"
                color={!!formState.errors?.heroDescription ? red[700] : ""}
              >
                Hero Description
              </Typography>
              <TextField
                {...field}
                error={!!formState.errors?.heroDescription}
                placeholder="Hero Description"
                multiline
                minRows={2}
                maxRows={10}
              />
              {!!formState.errors?.heroDescription ? (
                <FormHelperText error>
                  {errors?.heroDescription?.message}
                </FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          )}
            name="heroDescription"
            control={control}
            defaultValue=""
          />
        </Box>
        <Box sx={{ mb: 3, mt: 4 }}>
          <PageHeader title={"Industry Section"} handleAddClick={uploadImageShowModal} />
        </Box>
        {isLoading ? (
          <SpinnerLoading mt={8} />
        ) : (
          <>
            <Box sx={{ mb: 3, mt: 4 }}>
              <Stack justifyContent={"space-between"} flexWrap={"wrap"} gap={1}>
                <Typography variant="modalInnerTitle">Industry Image</Typography>
                <CustomButton
                  text={"Select Image"}
                  variant={"outlined"}
                  onClick={() => handleShowMediaModal("industryImage")}
                />
              </Stack>
              <Divider sx={{ mt: 1 }} />
              <Stack justifyContent={"space-between"}
                flexWrap={"wrap"}
                gap={1}
                mt={2}
              >
                <Avatar src={
                  storeUploadImages?.industryImage
                    ? `${IMG_URL}/${storeUploadImages?.industryImage?.path
                    }`
                    : "hi"
                }
                  variant="square"
                  alt="Image"
                  sx={{
                    width: "auto",
                    height: "auto",
                    maxWidth: 200,
                    maxHeight: 100,
                    minWidth: 50,
                    minHeight: 50,
                  }}
                />
              </Stack>
            </Box>
          </>
        )}
        <Box>
          <Controller render={({ field, formState }) => (
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <Typography
                variant="formLabel"
                color={!!formState.errors?.industryDescription ? red[700] : ""}
              >
                Industry Description
              </Typography>
              <TextField {...field}
                error={!!formState.errors?.industryDescription}
                placeholder="Industry Description"
                multiline minRows={2} maxRows={10}
              />
              {!!formState.errors?.industryDescription ? (
                <FormHelperText error>
                  {errors?.industryDescription?.message}
                </FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          )}
            name="industryDescription"
            control={control}
            defaultValue=""
          />
        </Box>
        <Box sx={{ mb: 3, mt: 4 }}>
          <Stack justifyContent={"space-between"} flexWrap={"wrap"} gap={1}>
            <Typography variant="modalInnerTitle">Turnkey Production Process</Typography>
          </Stack>
          <Divider sx={{ mt: 1 }} />
        </Box>
        <Box>
          <Controller render={({ field, formState }) => (
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <Typography
                variant="formLabel"
                color={!!formState.errors?.productionProcessTitle ? red[700] : ""}
              >
                Production Process Title
              </Typography>
              <TextField {...field}
                error={!!formState.errors?.productionProcessTitle}
                placeholder="Production Process Title"
                multiline
              />
              {!!formState.errors?.productionProcessTitle ? (
                <FormHelperText error>
                  {errors?.productionProcessTitle?.message}
                </FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          )}
            name="productionProcessTitle"
            control={control}
            defaultValue=""
          />
          <Controller render={({ field, formState }) => (
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <Typography
                variant="formLabel"
                color={!!formState.errors?.productionProcessSubTitle ? red[700] : ""}
              >
                Production Process Sub Title
              </Typography>
              <TextField {...field}
                error={!!formState.errors?.productionProcessSubTitle}
                placeholder="Production Process Sub Title"
                multiline
              />
              {!!formState.errors?.productionProcessSubTitle ? (
                <FormHelperText error>
                  {errors?.productionProcessSubTitle?.message}
                </FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          )}
            name="productionProcessSubTitle"
            control={control}
            defaultValue=""
          />
        </Box>
        {isLoading ? (
          <SpinnerLoading mt={8} />
        ) : (
          <>
            <Box sx={{ mb: 3, mt: 7 }}>
              <Box sx={{ display: { sm: "block", xs: "none" } }}>
                <Grid container spacing={2}>
                  <Grid item sm={3} xs={5}>
                    <Typography variant="formTitle">Process Start</Typography>
                  </Grid>
                  <Grid item sm={4} xs={7}>
                    <Typography variant="formTitle">Title</Typography>
                  </Grid>
                  <Grid item sm={4} xs={10}>
                    <Typography variant="formTitle">Description</Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ mt: 1, mb: 3 }} />
              </Box>
              <Grid
                container
                spacing={2}
                alignItems={"center"}
                sx={{ mb: 1 }}
              >
                <Grid item sm={3} xs={5}>
                  <Stack justifyContent={"space-between"} gap={1}>
                  </Stack>
                </Grid>
                <Grid item sm={4} xs={7}>
                  <Controller
                    render={({ field, formState }) => (
                      <FormControl fullWidth variant="outlined">
                        <TextField
                          {...field}
                          error={
                            Object.keys(formState?.errors).length > 0
                              ? !!formState?.errors?.processStart[0]
                                ?.title
                              : false
                          }
                          placeholder="Enter Title"
                        />

                        {Object.keys(formState?.errors).length > 0 &&
                          !!formState?.errors?.processStart[0]?.title ? (
                          <FormHelperText error>
                            {
                              formState?.errors?.processStart[0]?.title
                                ?.message
                            }
                          </FormHelperText>
                        ) : (
                          ""
                        )}
                      </FormControl>
                    )}
                    name={`processStart.0.title`}
                    control={control}
                    defaultValue=""
                  />
                </Grid>
                <Grid item sm={4} xs={7}>
                  <Controller
                    render={({ field, formState }) => (
                      <FormControl fullWidth variant="outlined">
                        <TextField
                          {...field}
                          error={
                            Object.keys(formState?.errors).length > 0
                              ? !!formState?.errors?.processStart[0]
                                ?.description
                              : false
                          }
                          placeholder="Enter Description"
                        />

                        {Object.keys(formState?.errors).length > 0 &&
                          !!formState?.errors?.processStart?.[0].description ? (
                          <FormHelperText error>
                            {
                              formState?.errors?.processStart?.[0].description
                                ?.message
                            }
                          </FormHelperText>
                        ) : (
                          ""
                        )}
                      </FormControl>
                    )}
                    name={`processStart.0.description`}
                    control={control}
                    defaultValue=""
                  />
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mb: 3, mt: 7 }}>
              <Box sx={{ display: { sm: "block", xs: "none" } }}>
                <Grid container spacing={2}>
                  <Grid item sm={3} xs={5}>
                    <Typography variant="formTitle">Process End</Typography>
                  </Grid>
                  <Grid item sm={4} xs={7}>
                    <Typography variant="formTitle">Title</Typography>
                  </Grid>
                  <Grid item sm={4} xs={10}>
                    <Typography variant="formTitle">Description</Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ mt: 1, mb: 3 }} />
              </Box>
              <Grid
                container
                spacing={2}
                alignItems={"center"}
                sx={{ mb: 1 }}
              >
                <Grid item sm={3} xs={5}>
                  <Stack justifyContent={"space-between"} gap={1}>
                  </Stack>
                </Grid>
                <Grid item sm={4} xs={7}>
                  <Controller
                    render={({ field, formState }) => (
                      <FormControl fullWidth variant="outlined">
                        <TextField
                          {...field}
                          error={
                            Object.keys(formState?.errors).length > 0
                              ? !!formState?.errors?.processEnd[0]
                                ?.title
                              : false
                          }
                          placeholder="Enter Title"
                        />

                        {Object.keys(formState?.errors).length > 0 &&
                          !!formState?.errors?.processEnd[0]?.title ? (
                          <FormHelperText error>
                            {
                              formState?.errors?.processEnd[0]?.title
                                ?.message
                            }
                          </FormHelperText>
                        ) : (
                          ""
                        )}
                      </FormControl>
                    )}
                    name={`processEnd.0.title`}
                    control={control}
                    defaultValue=""
                  />
                </Grid>
                <Grid item sm={4} xs={7}>
                  <Controller
                    render={({ field, formState }) => (
                      <FormControl fullWidth variant="outlined">
                        <TextField
                          {...field}
                          error={
                            Object.keys(formState?.errors).length > 0
                              ? !!formState?.errors?.processEnd[0]
                                ?.description
                              : false
                          }
                          placeholder="Enter Description"
                        />

                        {Object.keys(formState?.errors).length > 0 &&
                          !!formState?.errors?.processEnd[0]?.description ? (
                          <FormHelperText error>
                            {
                              formState?.errors?.processEnd[0]?.description
                                ?.message
                            }
                          </FormHelperText>
                        ) : (
                          ""
                        )}
                      </FormControl>
                    )}
                    name={`processEnd.0.description`}
                    control={control}
                    defaultValue=""
                  />
                </Grid>
              </Grid>
            </Box>
          </>
        )}
        {isLoading ? (
          <SpinnerLoading mt={8} />
        ) : (
          <>
            <Box sx={{ mb: 3, mt: 7 }}>
              <Box sx={{ display: { sm: "block", xs: "none" } }}>
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
              </Box>
              {processFields?.length > 0 ? (
                processFields?.map((item, index) => {
                  return (
                    <Grid
                      container
                      spacing={2}
                      alignItems={"center"}
                      sx={{ mb: 1 }}
                      key={index}
                    >
                      <Grid item sm={3} xs={5}>
                        <Stack justifyContent={"space-between"} gap={1}>
                          <Avatar
                            src={
                              getValues(`processes.${index}.prImage`)
                                ? `${IMG_URL}/${getValues(`processes.${index}.prImage`)?.path
                                }`
                                : "hi"
                            }
                            variant="square"
                            alt="image"
                            sx={{
                              width: "auto",
                              height: "auto",
                              maxWidth: 60,
                              maxHeight: 60,
                              minWidth: 20,
                              minHeight: 20,
                            }}
                          />
                          <Button
                            variant="contained"
                            sx={{ fontSize: 11, p: { md: 1, xs: "5px" } }}
                            onClick={() => handleShowMediaModal("prImage", index)}
                          >
                            Select Image
                          </Button>
                        </Stack>
                      </Grid>
                      <Grid item sm={4} xs={7}>
                        <Controller
                          render={({ field, formState }) => (
                            <FormControl fullWidth variant="outlined">
                              <TextField
                                {...field}
                                error={
                                  Object.keys(formState?.errors).length > 0
                                    ? !!formState?.errors?.processes[index]
                                      ?.title
                                    : false
                                }
                                placeholder="Enter Title"
                              />

                              {Object.keys(formState?.errors).length > 0 &&
                                !!formState?.errors?.processes[index]?.title ? (
                                <FormHelperText error>
                                  {
                                    formState?.errors?.processes[index]?.title
                                      ?.message
                                  }
                                </FormHelperText>
                              ) : (
                                ""
                              )}
                            </FormControl>
                          )}
                          name={`processes.${index}.title`}
                          control={control}
                          defaultValue=""
                        />
                      </Grid>
                      <Grid item sm={4} xs={7}>
                        <Controller
                          render={({ field, formState }) => (
                            <FormControl fullWidth variant="outlined">
                              <TextField
                                {...field}
                                error={
                                  Object.keys(formState?.errors).length > 0
                                    ? !!formState?.errors?.processes[index]
                                      ?.description
                                    : false
                                }
                                placeholder="Enter Description"
                              />

                              {Object.keys(formState?.errors).length > 0 &&
                                !!formState?.errors?.processes[index]?.description ? (
                                <FormHelperText error>
                                  {
                                    formState?.errors?.processes[index]?.description
                                      ?.message
                                  }
                                </FormHelperText>
                              ) : (
                                ""
                              )}
                            </FormControl>
                          )}
                          name={`processes.${index}.description`}
                          control={control}
                          defaultValue=""
                        />
                      </Grid>
                      <Grid item sm={1} xs={1} sx={{ textAlign: "end" }}>
                        <IconButton
                          sx={{ border: "1px solid #c4c4c4" }}
                          onClick={() => removeProcess(index)}
                        >
                          <FaTimes size={17} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  );
                })
              ) : (
                <Typography variant="formTitle" align="center" width={1} mt={5}>
                  No processes list create yet{" "}
                </Typography>
              )}

              <Box sx={{ mt: 8 }}>
                <CustomButton
                  isStartIcon={true}
                  icon={<AiOutlinePlus />}
                  onClick={handleAddProcess}
                />
              </Box>
            </Box>
          </>
        )}
     <Box sx={{ mb: 3, mt: 4 }}>
          <PageHeader title={"Refference Layout"} handleAddClick={uploadImageShowModal} />
        </Box>
        {isLoading ? (
          <SpinnerLoading mt={8} />
        ) : (
          <>
            <Box sx={{ mb: 3, mt: 4 }}>
              <Stack justifyContent={"space-between"} flexWrap={"wrap"} gap={1}>
                <Typography variant="modalInnerTitle">Refference Layout Image</Typography>
                <CustomButton
                  text={"Select Image"}
                  variant={"outlined"}
                  onClick={() => handleShowMediaModal("refLayoutImage")}
                />
              </Stack>
              <Divider sx={{ mt: 1 }} />
              <Stack justifyContent={"space-between"}
                flexWrap={"wrap"}
                gap={1}
                mt={2}
              >
                <Avatar src={
                  storeUploadImages?.refLayoutImage
                    ? `${IMG_URL}/${storeUploadImages?.refLayoutImage?.path
                    }`
                    : "hi"
                }
                  variant="square"
                  alt="Image"
                  sx={{
                    width: "auto",
                    height: "auto",
                    maxWidth: 200,
                    maxHeight: 100,
                    minWidth: 50,
                    minHeight: 50,
                  }}
                />
              </Stack>
            </Box>
          </>
        )}
        <Box>
          <Controller render={({ field, formState }) => (
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <Typography
                variant="formLabel"
                color={!!formState.errors?.refLayoutTitle ? red[700] : ""}
              >
                Refference Layout Title
              </Typography>
              <TextField {...field}
                error={!!formState.errors?.refLayoutTitle}
                placeholder="Refference Layout Title"
                multiline
              />
              {!!formState.errors?.refLayoutTitle ? (
                <FormHelperText error>
                  {errors?.refLayoutTitle?.message}
                </FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          )}
            name="refLayoutTitle"
            control={control}
            defaultValue=""
          />
        </Box>
        <Box sx={{ mb: 3, mt: 4 }}>
          <Stack justifyContent={"space-between"} flexWrap={"wrap"} gap={1}>
            <Typography variant="modalInnerTitle">Refference Layout Machine Positions</Typography>
          </Stack>
          <Divider sx={{ mt: 1 }} />
        </Box>
        {isLoading ? (
          <SpinnerLoading mt={8} />
        ) : (
          <>
            <Box sx={{ mb: 3, mt: 7 }}>
              <Box sx={{ display: { sm: "block", xs: "none" } }}>
                <Grid container spacing={2}>
                  <Grid item sm={2} xs={2}>
                    <Typography variant="formTitle">Image</Typography>
                  </Grid>
                  <Grid item sm={2} xs={2}>
                    <Typography variant="formTitle">x</Typography>
                  </Grid>
                  <Grid item sm={2} xs={2}>
                    <Typography variant="formTitle">y</Typography>
                  </Grid>
                  <Grid item sm={2} xs={2}>
                    <Typography variant="formTitle">Title</Typography>
                  </Grid>
                  <Grid item sm={3} xs={3}>
                    <Typography variant="formTitle">Description</Typography>
                  </Grid>
                  <Grid item sm={1} xs={1}>
                    <Typography variant="formTitle">Action</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ mt: 1, mb: 3 }} />
              </Box>
              {refLayoutFields?.length > 0 ? (
                refLayoutFields?.map((item, index) => {
                  return (
                    <Grid
                      container
                      spacing={2}
                      alignItems={"center"}
                      sx={{ mb: 1 }}
                      key={index}
                    >
                      <Grid item sm={2} xs={2}>
                        <Stack justifyContent={"space-between"} gap={1}>
                          <Avatar
                            src={
                              getValues(`refLayoutMachinePositions.${index}.poImage`)
                                ? `${IMG_URL}/${getValues(`refLayoutMachinePositions.${index}.poImage`)?.path
                                }`
                                : "hi"
                            }
                            variant="square"
                            alt="image"
                            sx={{
                              width: "auto",
                              height: "auto",
                              maxWidth: 60,
                              maxHeight: 60,
                              minWidth: 20,
                              minHeight: 20,
                            }}
                          />
                          <Button
                            variant="contained"
                            sx={{ fontSize: 11, p: { md: 1, xs: "5px" } }}
                            onClick={() => handleShowMediaModal("poImage", index)}
                          >
                            Select Image
                          </Button>
                        </Stack>
                      </Grid>
                      <Grid item sm={2} xs={2}>
                        <Controller
                          render={({ field, formState }) => (
                            <FormControl fullWidth variant="outlined">
                              <TextField
                                {...field}
                                error={
                                  Object.keys(formState?.errors).length > 0
                                    ? !!formState?.errors?.refLayoutMachinePositions[index]
                                      ?.x
                                    : false
                                }
                                placeholder="Enter x"
                              />

                              {Object.keys(formState?.errors).length > 0 &&
                                !!formState?.errors?.refLayoutMachinePositions[index]?.x ? (
                                <FormHelperText error>
                                  {
                                    formState?.errors?.refLayoutMachinePositions[index]?.x
                                      ?.message
                                  }
                                </FormHelperText>
                              ) : (
                                ""
                              )}
                            </FormControl>
                          )}
                          name={`refLayoutMachinePositions.${index}.x`}
                          control={control}
                          defaultValue=""
                        />
                      </Grid>
                      <Grid item sm={2} xs={2}>
                        <Controller
                          render={({ field, formState }) => (
                            <FormControl fullWidth variant="outlined">
                              <TextField
                                {...field}
                                error={
                                  Object.keys(formState?.errors).length > 0
                                    ? !!formState?.errors?.refLayoutMachinePositions[index]
                                      ?.y
                                    : false
                                }
                                placeholder="Enter y"
                              />

                              {Object.keys(formState?.errors).length > 0 &&
                                !!formState?.errors?.refLayoutMachinePositions[index]?.y ? (
                                <FormHelperText error>
                                  {
                                    formState?.errors?.refLayoutMachinePositions[index]?.y
                                      ?.message
                                  }
                                </FormHelperText>
                              ) : (
                                ""
                              )}
                            </FormControl>
                          )}
                          name={`refLayoutMachinePositions.${index}.y`}
                          control={control}
                          defaultValue=""
                        />
                      </Grid>
                      <Grid item sm={2} xs={2}>
                        <Controller
                          render={({ field, formState }) => (
                            <FormControl fullWidth variant="outlined">
                              <TextField
                                {...field}
                                error={
                                  Object.keys(formState?.errors).length > 0
                                    ? !!formState?.errors?.refLayoutMachinePositions[index]
                                      ?.title
                                    : false
                                }
                                placeholder="Enter Title"
                              />

                              {Object.keys(formState?.errors).length > 0 &&
                                !!formState?.errors?.refLayoutMachinePositions[index]?.title ? (
                                <FormHelperText error>
                                  {
                                    formState?.errors?.refLayoutMachinePositions[index]?.title
                                      ?.message
                                  }
                                </FormHelperText>
                              ) : (
                                ""
                              )}
                            </FormControl>
                          )}
                          name={`refLayoutMachinePositions.${index}.title`}
                          control={control}
                          defaultValue=""
                        />
                      </Grid>
                      <Grid item sm={3} xs={3}>
                        <Controller
                          render={({ field, formState }) => (
                            <FormControl fullWidth variant="outlined">
                              <TextField
                                {...field}
                                error={
                                  Object.keys(formState?.errors).length > 0
                                    ? !!formState?.errors?.refLayoutMachinePositions[index]
                                      ?.description
                                    : false
                                }
                                placeholder="Enter Description"
                              />

                              {Object.keys(formState?.errors).length > 0 &&
                                !!formState?.errors?.refLayoutMachinePositions[index]?.description ? (
                                <FormHelperText error>
                                  {
                                    formState?.errors?.refLayoutMachinePositions[index]?.description
                                      ?.message
                                  }
                                </FormHelperText>
                              ) : (
                                ""
                              )}
                            </FormControl>
                          )}
                          name={`refLayoutMachinePositions.${index}.description`}
                          control={control}
                          defaultValue=""
                        />
                      </Grid>
                      <Grid item sm={1} xs={1} sx={{ textAlign: "end" }}>
                        <IconButton
                          sx={{ border: "1px solid #c4c4c4" }}
                          onClick={() => removeRefLayout(index)}
                        >
                          <FaTimes size={17} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  );
                })
              ) : (
                <Typography variant="formTitle" align="center" width={1} mt={5}>
                  No Refference list create yet{" "}
                </Typography>
              )}

              <Box sx={{ mt: 8 }}>
                <CustomButton
                  isStartIcon={true}
                  icon={<AiOutlinePlus />}
                  onClick={handleAddRefLayout}
                />
              </Box>
            </Box>
          </>
        )}
        <SubmitButton isShowCancelBtn={false} />
      </Box>

      {/* Upload Image  */}
      <Modal
        isShowModal={uploadMediaModal}
        title={"Upload Image "}
        handleCloseModal={uploadImageHideModal}
        width={"1200px"}
      >
        <UploadMedia
          handleCancel={uploadImageHideModal}
          handleUploadSubmit={handleUploadSubmit}
        />
      </Modal>
      {/* Select Media  */}
      {/* <Modal
        isShowModal={editShow || addShow}
        title={"Select Attachments"}
        handleCloseModal={uploadMediaHideModal}
        width={"1200px"}
      >
        <MediaAllList
          handleCancel={uploadMediaHideModal}
          handleAttachmentsSubmit={handleAttachmentsSubmit}
          selectType={1}
        />
      </Modal> */}
      {/* Select Refference Image */}
      <Modal
        isShowModal={editShow || addShow}
        title={"Select Attachments"}
        handleCloseModal={uploadMediaHideModal}
        width={"1200px"}
      >
        <MediaAllRefferenceImage
          handleCancel={uploadMediaHideModal}
          handleAttachmentsSubmit={handleAttachmentsSubmit}
          selectType={1}
        />
      </Modal>
    </Paper>
  );
}
export default SingleIndustryPage;