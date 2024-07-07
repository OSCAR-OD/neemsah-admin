import {
  Avatar,
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useEffect, useReducer, useState } from "react";
import SubmitButton from "../../Form/SubmitButton";
import { AiOutlinePlayCircle } from "react-icons/ai";
import CustomButton from "../../Button/CustomButton";
import AllMediaSkeleton from "../../Skeleton/Media/AllMediaSkeleton";
import {
  fetchReducer,
  getApiHandler,
  initialFetchData,
} from "../../../lib/axios/ApiHelper";
import ErrorMessage from "../../Error/ErrorMessage";
import DataNotFound from "../../NotFound/DataNotFound";
import { red } from "@mui/material/colors";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { toast } from "react-toastify";
import SpinnerLoading from "../../Skeleton/Spinner/SpinnerLoading";
import useWindowDimensions from "../../../Hooks/Theme/useWindowDimensions";

//Validation Form
const validationSchema = Yup.object().shape({
  // title: Yup.string().required("Title is required"),
  // description: Yup.string().required("Description is required"),
  // altText: Yup.string(),
});
function MediaEmployeeList({
  handleCancel,
  handleAttachmentsSubmit,
  selectType,
  isEditMood,
  editMoodId,
  fetchSinglePath,
}) {
  const IMG_URL = "https://api.neemsah.com";
  //const IMG_URL = "http://localhost:5500";
  //const IMG_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const [{ isLoading, isError, errorMessage, fetchData }, dispatch] =
    useReducer(fetchReducer, initialFetchData);
  const [selectedAttachment, setSelectedAttachment] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isShowLoadBtn, setIsShowLoadBtn] = useState(true);
  const [mediaLimit, setMediaLimit] = useState(30);

  //Context
  const { width } = useWindowDimensions();
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

  //Attachments selected
  const handleSelectedImage = (item) => {
    if (selectType === 1) {
      setSelectedAttachment([item?._id]);
    } else if (selectType === 0) {
    //  console.log("code for mulitple selected");
    }
  };

  //Pagination
  const handlePagination = () => {
   // console.log("s");

    setCurrentPage((prev) => prev + 1);
  };

  //Get all media attachments
  const getMedia = async () => {
    dispatch({ type: "LOADING" });
    const res = await getApiHandler("/admin/files/all", {
      page: currentPage,
      size: mediaLimit,
    });
    if (res?.success) {
      const dataFormat = [...fetchData, ...res.data.data];
      dispatch({ type: "LOADED", dataFormat });
      if (res?.data?.total === res?.data?.end) {
        setIsShowLoadBtn(false);
      }
    } else {
      if (res?.response?.status === 404) {
        const errorFormat = "Data not found";
        dispatch({ type: "ERROR", errorFormat });
      } else {
        const errorFormat = "Something went wrong";
        dispatch({ type: "ERROR", errorFormat });
      }
    }
  };

  //Get single media attachments
  const getSingleMedia = async () => {
    const res = await getApiHandler(
      `/admin/${fetchSinglePath}/singleHrmEmployee/${editMoodId}`
    );
    if (res?.success) {
      const { name, designation, email, phone, address, role, accountStatus, password, image } = res?.data;
      //console.log("res?.data", res?.data);
      setValue("name", name);
      setValue("designation", designation);
      setValue("email", email);
      setValue("phone", phone);
      setValue("address", address);
      setValue("role", role);
      setValue("accountStatus", accountStatus);
      setValue("password", password);
      setSelectedAttachment([image?._id]);
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data not found");
      } else {
        toast.warn("Something went wrong");
      }
    }
  };

  useEffect(() => {
    getMedia();
  }, [currentPage]);

  useEffect(() => {
    if (isEditMood) {
      getSingleMedia();
    }
  }, []);

  useEffect(() => {
    if (width >= 1500) {
      setMediaLimit(30);
    } else if (width >= 1200 && width <= 1499) {
      setMediaLimit(24);
    } else if (width >= 900 && width <= 1199) {
      setMediaLimit(18);
    } else if (width >= 600 && width <= 899) {
      setMediaLimit(15);
    } else if (width <= 599) {
      setMediaLimit(12);
    }
  }, [width]);

  //Condition Render
  let contentRender;

  if (isLoading && fetchData?.length <= 0) {
    contentRender = <AllMediaSkeleton />;
  } else if (isError) {
    return <ErrorMessage message={errorMessage} />;
  } else if (fetchData?.length <= 0) {
    contentRender = <DataNotFound />;
  } else if (fetchData?.length > 0) {
    contentRender = (
      <Box sx={{ mt: 3 }}>
        <Box sx={{ maxHeight: 550, overflow: "auto" }}>
          <Grid container spacing={2}>
            {fetchData?.map((item, index) => {
              return (
                <Grid
                  item
                  lg={2}
                  sm={3}
                  xs={6}
                  key={item?._id}
                  sx={{ position: "relative" }}
                >
                  {item?.type?.includes("video") ? (
                    <>
                      <Box
                        component={"video"}
                        src={`${IMG_URL}/${item?.path}`}
                        sx={{
                          width: 1,
                          height: 150,
                          cursor: "pointer",
                          border: selectedAttachment?.includes(item?._id)
                            ? "2px solid #4FB5E5"
                            : "",
                          "&:hover": {
                            opacity: 0.8,
                          },
                        }}
                        onClick={() => handleSelectedImage(item)}
                      ></Box>
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
                    </>
                  ) : (
                    <Avatar
                      alt={item?.caption}
                      src={`${IMG_URL}/${item?.path}`}
                      variant="rounded"
                      sx={{
                        width: 1,
                        height: 150,
                        cursor: "pointer",
                        //border:"1px solid #d7d7d7",
                        border:
                          selectType === 1
                            ? selectedAttachment?.includes(item?._id)
                              ? "2px solid #4FB5E5"
                              : ""
                            : multipleSelectedAttachment?.includes(item?._id)
                            ? "2px solid #4FB5E5"
                            : "",
                        "&:hover": {
                          opacity: 0.8,
                        },
                      }}
                      onClick={() => handleSelectedImage(item)}
                    />
                  )}
                </Grid>
              );
            })}
          </Grid>
          {isLoading && fetchData?.length > 0 && (
            <Grid item xs={12}>
              <Box sx={{ mt: 3 }}>
                <AllMediaSkeleton />
              </Box>
            </Grid>
          )}
          {isShowLoadBtn && (
            <Box sx={{ textAlign: "center", mt: 6, mb: 10 }}>
              <CustomButton
                text={"Load More"}
                onClick={handlePagination}
                isDisabled={isLoading && fetchData?.length > 0 ? true : false}
                isEndIcon={isLoading && fetchData?.length > 0 ? true : false}
                icon={<CircularProgress color="secondary" size={16} />}
              />
            </Box>
          )}
        </Box>
        <Box>
          <Grid container spacing={2}>
            <Grid item sm={6} xs={12}>
              <Controller
                render={({ field, formState }) => (
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <Typography
                      variant="formLabel"
                      color={!!formState.errors?.name ? red[700] : ""}
                    >
                      Employee Name
                    </Typography>
                    <TextField
                      {...field}
                      error={!!formState.errors?.name}
                      placeholder="Employee Name"
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
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <Typography
                      variant="formLabel"
                      color={!!formState.errors?.designation ? red[700] : ""}
                    >
                    Employee Designation
                    </Typography>
                    <TextField
                      {...field}
                      error={!!formState.errors?.designation}
                      placeholder="Employee Designation"
                    />
                    {!!formState.errors?.designation ? (
                      <FormHelperText error>
                        {errors?.designation?.message}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                )}
                name="designation"
                control={control}
                defaultValue=""
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <Controller
                render={({ field, formState }) => (
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <Typography
                      variant="formLabel"
                      color={!!formState.errors?.email ? red[700] : ""}
                    >
                    Email
                    </Typography>
                    <TextField
                      {...field}
                      error={!!formState.errors?.email}
                      placeholder="Employee Email"
                    />
                    {!!formState.errors?.email ? (
                      <FormHelperText error>
                        {errors?.email?.message}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                )}
                name="email"
                control={control}
                defaultValue=""
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <Controller
                render={({ field, formState }) => (
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <Typography
                      variant="formLabel"
                      color={!!formState.errors?.phone ? red[700] : ""}
                    >
                    Phone
                    </Typography>
                    <TextField
                      {...field}
                      error={!!formState.errors?.phone}
                      placeholder="Employee Phone"
                    />
                    {!!formState.errors?.phone ? (
                      <FormHelperText error>
                        {errors?.phone?.message}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                )}
                name="phone"
                control={control}
                defaultValue=""
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <Controller
                render={({ field, formState }) => (
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <Typography
                      variant="formLabel"
                      color={!!formState.errors?.address ? red[700] : ""}
                    >
                    Employee Address
                    </Typography>
                    <TextField
                      {...field}
                      error={!!formState.errors?.address}
                      placeholder="Employee Address"
                      minRows={4}
                      maxRows={12}
                    />
                    {!!formState.errors?.address ? (
                      <FormHelperText error>
                        {errors?.address?.message}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                )}
                name="address"
                control={control}
                defaultValue=""
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <Controller
                render={({ field, formState }) => (
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <Typography
                      variant="formLabel"
                      color={!!formState.errors?.role ? red[700] : ""}
                    >
                      Role
                    </Typography>
                    <Select
                      {...field}
                      error={!!formState.errors?.role}
                      displayEmpty
                      placeholder="Role"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Super Admin">Super Admin</MenuItem>
                      <MenuItem value="Admin">Admin</MenuItem>
                      <MenuItem value="Manager">Manager</MenuItem>
                      <MenuItem value="Sales Employee">Sales Employee</MenuItem>
                      <MenuItem value="Service Employee">Service Employee</MenuItem>
                      <MenuItem value="User">User</MenuItem>
                    </Select>
                    {!!formState.errors?.role ? (
                      <FormHelperText error>
                        {errors?.role?.message}
                      </FormHelperText>
                    ) : (
                      <FormHelperText>Select role</FormHelperText>
                    )}
                  </FormControl>
                )}
                name="role"
                control={control}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <Controller
                render={({ field, formState }) => (
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <Typography
                      variant="formLabel"
                      color={!!formState.errors?.accountStatus ? red[700] : ""}
                    >
                      Account Status
                    </Typography>
                    <Select
                      {...field}
                      error={!!formState.errors?.accountStatus}
                      displayEmpty
                      placeholder="Account Status"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Deactivate">Deactivate</MenuItem>
                    </Select>
                    {!!formState.errors?.accountStatus ? (
                      <FormHelperText error>
                        {errors?.accountStatus?.message}
                      </FormHelperText>
                    ) : (
                      <FormHelperText>Select account status</FormHelperText>
                    )}
                  </FormControl>
                )}
                name="accountStatus"
                control={control}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <Controller
                render={({ field, formState }) => (
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <Typography
                      variant="formLabel"
                      color={!!formState.errors?.password ? red[700] : ""}
                    >
                    Password (Minimum 8 Digit)*
                    </Typography>
                    <TextField
                      {...field}
                      error={!!formState.errors?.password}
                      placeholder="Employee password"
                    />
                    {!!formState.errors?.password ? (
                      <FormHelperText error>
                        {errors?.password?.message}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                )}
                name="password"
                control={control}
                defaultValue=""
              />
            </Grid>
          </Grid>
        </Box>
        {/* <Box sx={{ mt: 6, textAlign: "center" }}>
          <CustomButton text={"Load More"} />
        </Box> */}
      </Box>
    );
  }

  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit((data) =>
        handleAttachmentsSubmit(
          data,
          selectType === 1 ? selectedAttachment : multipleSelectedAttachment
        )
      )}
    >
      {contentRender}
      <SubmitButton
        onCancelClick={handleCancel}
        submitBtnText={isEditMood ? "Update" : "Save"}
      />
    </Box>
  );
}

MediaEmployeeList.defaultProps = {
  selectType: 1,
  fetchSinglePath: "hrm",
};

export default MediaEmployeeList;
