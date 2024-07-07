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
import { red } from "@mui/material/colors";
import * as Yup from "yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import SubmitButton from "../../../Components/Form/SubmitButton";
import CustomButton from "../../../Components/Button/CustomButton";
import { useEffect, useReducer, useState } from "react";
import {
  initialAction,
  userActionReducer,
} from "../../../utils/Action/ManageUserAction";
import Modal from "../../../Components/Modal/Modal";
import MediaAllList from "../../../Components/Media/MediaAllList";
import { FaTimes } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { getApiHandler, postApiHandler } from "../../../lib/axios/ApiHelper";
import { toast } from "react-toastify";
import SpinnerLoading from "../../../Components/Skeleton/Spinner/SpinnerLoading";

//Validation Form
const validationSchema = Yup.object().shape({
  phone: Yup.string("Enter valid number"),
  // phone: Yup.number("Enter valid number")
  //   .positive("Enter positive number")
  //   .typeError("Enter a number"),
  email: Yup.string(),
  // email: Yup.string().email("Enter valid email"),
  description: Yup.string(),
  copyright: Yup.string(),
  socialList: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required("Title is required"),
      btnLink: Yup.string().url("Enter valid url").nullable(),
      icon: Yup.object(),
    })
  ),
});

function MainSettingsPage() {
  const IMG_URL = "https://api.neemsah.com";
  //const IMG_URL = "http://localhost:5500";
  //const IMG_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const [
    { addShow, editShow, editShowId, deleteShow, deleteId },
    dispatchUser,
  ] = useReducer(userActionReducer, initialAction);
  const [storeUploadImages, setStoreUploadImages] = useState({
    logo: null,
    favIcon: null,
    icon: null,
    status: null,
    index: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditSettings, setIsEditSettings] = useState(true);
  const [settingsDataList, setSettingsDataList] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(false);

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
      // socialList: [{ title: "", btnLink: "", icon: [] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialList",
  });

  //Submit attachment form
  const handleAttachmentsSubmit = (e, selectedAttachment) => {
    e.preventDefault();

    uploadMediaHideModal();
    if (storeUploadImages?.status === "logo") {
      setStoreUploadImages({
        ...storeUploadImages,
        logo: selectedAttachment[0],
      });
    } else if (storeUploadImages?.status === "favIcon") {
      setStoreUploadImages({
        ...storeUploadImages,
        favIcon: selectedAttachment[0],
      });
    } else if (storeUploadImages?.status === "icon") {
      setValue(
        `socialList.${storeUploadImages?.index}.icon`,
        selectedAttachment[0]
      );
    }
  };

  // Submit form
  const onSubmit = async (data) => {
    const formatSocialList = data?.socialList?.map((item) => {
      return {
        title: item?.title,
        btnLink: item?.btnLink,
        icon: item?.icon?._id,
      };
    });

    const res = await postApiHandler(
      isEditSettings
        ? `/admin/setting/edit/${settingsDataList?.customID}`
        : `/admin/setting/add`,
      {
        description: data?.description || "",
        copyright: data?.copyright || "",
        headerIcon:
          storeUploadImages?.logo?._id ||
          settingsDataList?.headerIcon?._id ||
          "",
        favIcon:
          storeUploadImages?.favIcon?._id ||
          settingsDataList?.favIcon?._id ||
          "",
        social: formatSocialList || [],
      }
    );
    //console.log('data', data);
    if (res?.success) {
      setShouldFetch((prev) => !prev);
      toast.success("Settings saved");
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data not found");
      } else {
        toast.warn("Something went wrong");
      }
    }
  };

  //Header logo select
  const handleShowMediaModal = (type, index) => {
    dispatchUser({ type: "ADD/SHOW" });
    if (type === "icon") {
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
      icon: null,
      status: null,
      index: null,
    });
  };

  //Add social media
  const handleAddList = () => {
    append({ title: "", btnLink: "", icon: {} });
    // setValue("socialList.0.title","hi")
  };

  //Get all media attachments
  const getMedia = async () => {
    setIsLoading(true);
    const res = await getApiHandler("/admin/setting/all");
    if (res?.success) {
      const dataFormat = res.data[0];
      if (res?.data?.length > 0) {
        const {description, copyright, headerIcon, favIcon, social } =
          dataFormat;

        setIsEditSettings(true);
        setSettingsDataList(dataFormat);
        setValue("description", description);
        setValue("copyright", copyright);
        setValue("socialList", social);
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
      if (res?.response?.status === 404) {
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
    getMedia();
  }, [shouldFetch]);

  return (
    <Paper
      sx={{
        maxWidth: 900,
        width: 1,
        mx: "auto",
        py: { sm: 3, xs: 2 },
        px: { sm: 3, xs: 1 },
      }}
    >
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mb: 3 }}>
          <Controller
            render={({ field, formState }) => (
              <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                <Typography
                  variant="formLabel"
                  color={!!formState.errors?.description ? red[700] : ""}
                >
                  Description
                </Typography>

                <TextField
                  {...field}
                  error={!!formState.errors?.description}
                  placeholder="Enter Description"
                  multiline
                  minRows={2}
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
                  <Controller
            render={({ field, formState }) => (
              <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                <Typography
                  variant="formLabel"
                  color={!!formState.errors?.copyright ? red[700] : ""}
                >
                  Copyright
                </Typography>

                <TextField
                  {...field}
                  error={!!formState.errors?.copyright}
                  placeholder="Enter Description"
                  multiline
                  minRows={2}
                  maxRows={10}
                />
                {!!formState.errors?.copyright ? (
                  <FormHelperText error>
                    {errors?.copyright?.message}
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            )}
            name="copyright"
            control={control}
            defaultValue=""
          />
        </Box>

        {isLoading ? (
          <SpinnerLoading mt={8} />
        ) : (
          <>
            <Box sx={{ mb: 3, mt: 4 }}>
              <Stack justifyContent={"space-between"} flexWrap={"wrap"} gap={1}>
                <Typography variant="modalInnerTitle">Logo</Typography>
                <CustomButton
                  text={"Select Logo"}
                  variant={"outlined"}
                  onClick={() => handleShowMediaModal("logo")}
                />
              </Stack>

              <Divider sx={{ mt: 1 }} />
              <Stack
                justifyContent={"space-between"}
                flexWrap={"wrap"}
                gap={1}
                mt={2}
              >
                <Avatar
                  src={
                    storeUploadImages?.logo
                      ? `${IMG_URL}/${
                          storeUploadImages?.logo?.path
                        }`
                      : "hi"
                  }
                  variant="square"
                  alt="Logo"
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
            <Box sx={{ mb: 3 }}>
              <Stack justifyContent={"space-between"} flexWrap={"wrap"} gap={1}>
                <Typography variant="modalInnerTitle">FavIcon</Typography>
                <CustomButton
                  text={"Select Logo"}
                  variant={"outlined"}
                  onClick={() => handleShowMediaModal("favIcon")}
                />
              </Stack>

              <Divider sx={{ mt: 1 }} />
              <Stack
                justifyContent={"space-between"}
                flexWrap={"wrap"}
                gap={1}
                mt={2}
              >
                <Avatar
                  src={
                    storeUploadImages?.favIcon
                      ? `${IMG_URL}/${
                          storeUploadImages?.favIcon?.path
                        }`
                      : "hi"
                  }
                  variant="square"
                  alt="favIcon"
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
            <Box sx={{ mb: 3, mt: 7 }}>
              <Box sx={{ display: { sm: "block", xs: "none" } }}>
                <Grid container spacing={2}>
                  <Grid item sm={3} xs={5}>
                    <Typography variant="formTitle">Icon</Typography>
                  </Grid>
                  <Grid item sm={4} xs={7}>
                    <Typography variant="formTitle">Title</Typography>
                  </Grid>
                  <Grid item sm={4} xs={10}>
                    <Typography variant="formTitle">Link</Typography>
                  </Grid>
                  <Grid item sm={1} xs={1}>
                    <Typography variant="formTitle">Action</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ mt: 1, mb: 3 }} />
              </Box>
              {fields?.length > 0 ? (
                fields?.map((item, index) => {
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
                              getValues(`socialList.${index}.icon`)
                                ? `${IMG_URL}/${
                                    getValues(`socialList.${index}.icon`)?.path
                                  }`
                                : "hi"
                            }
                            variant="square"
                            alt="icon"
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
                            onClick={() => handleShowMediaModal("icon", index)}
                          >
                            Select Icon
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
                                    ? !!formState?.errors?.socialList[index]
                                        ?.title
                                    : false
                                }
                                placeholder="Enter Title"
                              />

                              {Object.keys(formState?.errors).length > 0 &&
                              !!formState?.errors?.socialList[index]?.title ? (
                                <FormHelperText error>
                                  {
                                    formState?.errors?.socialList[index]?.title
                                      ?.message
                                  }
                                </FormHelperText>
                              ) : (
                                ""
                              )}
                            </FormControl>
                          )}
                          name={`socialList.${index}.title`}
                          control={control}
                          defaultValue=""
                        />
                      </Grid>
                      <Grid item sm={4} xs={10}>
                        <Controller
                          render={({ field, formState }) => (
                            <FormControl fullWidth variant="outlined">
                              <TextField
                                {...field}
                                error={
                                  Object.keys(formState?.errors).length > 0
                                    ? !!formState?.errors?.socialList[index]
                                        ?.btnLink
                                    : false
                                }
                                placeholder="Enter Link"
                              />

                              {Object.keys(formState?.errors).length > 0 &&
                              !!formState?.errors?.socialList[index]
                                ?.btnLink ? (
                                <FormHelperText error>
                                  {
                                    formState?.errors?.socialList[index]
                                      ?.btnLink?.message
                                  }
                                </FormHelperText>
                              ) : (
                                ""
                              )}
                            </FormControl>
                          )}
                          name={`socialList.${index}.btnLink`}
                          control={control}
                          defaultValue=""
                        />
                      </Grid>
                      <Grid item sm={1} xs={1} sx={{ textAlign: "end" }}>
                        <IconButton
                          sx={{ border: "1px solid #c4c4c4" }}
                          onClick={() => remove(index)}
                        >
                          <FaTimes size={17} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  );
                })
              ) : (
                <Typography variant="formTitle" align="center" width={1} mt={5}>
                  No social list create yet{" "}
                </Typography>
              )}

              <Box sx={{ mt: 8 }}>
                <CustomButton
                  isStartIcon={true}
                  icon={<AiOutlinePlus />}
                  onClick={handleAddList}
                />
              </Box>
            </Box>
          </>
        )}
        <SubmitButton isShowCancelBtn={false} />
      </Box>

      {/* Upload Media  */}
      <Modal
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
      </Modal>
    </Paper>
  );
}

export default MainSettingsPage;
