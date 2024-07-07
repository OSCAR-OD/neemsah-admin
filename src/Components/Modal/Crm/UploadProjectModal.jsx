import {
  Avatar,
  Box,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { red } from "@mui/material/colors";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SubmitButton from "../../Form/SubmitButton";
import { toast } from "react-toastify";
import { getApiHandler } from "../../../lib/axios/ApiHelper";
import SpinnerLoading from "../../Skeleton/Spinner/SpinnerLoading";

// Validation Form
const validationSchema = Yup.object().shape({
  projectName: Yup.string().required("Project Name is required"),
  companyName: Yup.string().required("Company Name is required"),
  pid: Yup.string().required("pid is required"),
  application: Yup.string().required("Application is required"),
  assignedEmployee: Yup.string().required("Employee Assignment is required"),
  description: Yup.string().required("Description is required"),
});

function UploadProjectModal({
  isEditModal,
  handleFormSubmit,
  handleCancel,
  id,
  fetchPath
}) {
  const [isShowMediaModal, setIsShowMediaModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customerCompany, setCustomerCompany] = useState([]);
  const [employees, setEmployees] = useState([]);
  // react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      cid: "",
    },
  });

  const getCustomerCompany = async () => {
    return await getApiHandler("/admin/crm/allCustomers");
  };

  const getAllEmployee = async () => {
    return await getApiHandler("/admin/service/allEmployeeCard", {
      position: "AllEmployee",
    });
  };

  // Show Upload modal
  const uploadMediaShowModal = () => {
    setIsShowMediaModal(true);
  };

  // Hide Upload modal
  const uploadMediaHideModal = () => {
    setIsShowMediaModal(false);
  };

  // Get single media attachments
  const getSingleItem = async () => {
    setIsLoading(true);
    const res = await getApiHandler(`/admin/${fetchPath}/single/${id}`);
    if (res?.success) {
      const { projectName, pid, description, images } = res?.data;
      setValue("projectName", projectName);
      setValue("pid", pid);
      setValue("description", description);
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data not found");
      } else {
        toast.warn("Something went wrong");
      }
    }
    setIsLoading(false);
  };

  const getCustomer = async () => {
    const res = await getCustomerCompany();
    if (res?.success) {
      setCustomerCompany(res.data);
    }
  };

  const getEmployee = async () => {
    const res = await getAllEmployee();
    if (res?.success) {
      setEmployees(res.data);
    }
  };

  const projectNameValue = watch("projectName", "");

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const date = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');

    const pid = `${projectNameValue.replace(/ /g, '-').toUpperCase()}-${year}${date}${month}`;
    setValue("pid", pid);
  }, [projectNameValue, setValue]);

  useEffect(() => {
    getCustomer();
    getEmployee();
  }, []);

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
          handleFormSubmit(data)
        )}
      >
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <Controller
              render={({ field, formState }) => (
                <FormControl fullWidth variant="outlined">
                  <Typography
                    variant="formLabel"
                    color={!!formState.errors?.projectName ? red[700] : ""}
                  >
                    Project Name
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.projectName}
                    placeholder="Project Name"
                  />
                  {!!formState.errors?.projectName ? (
                    <FormHelperText error>
                      {errors?.projectName?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="projectName"
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
                    color={!!formState.errors?.pid ? red[700] : ""}
                  >
                    PID (YY-DD-MM)
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.pid}
                    placeholder="PID"
                  />
                  {!!formState.errors?.pid ? (
                    <FormHelperText error>
                      {errors?.pid?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="pid"
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
                    color={!!formState.errors?.companyName ? red[700] : ""}
                  >
                    Company Name
                  </Typography>
                  <Autocomplete
                    {...field}
                    options={customerCompany}
                    getOptionLabel={(option) => option.companyName || ""}
                    onChange={(e, value) => {
                      field.onChange(value ? value.companyName : "");
                      setValue("cid", value ? value.cid : "");
                    }}
                    value={customerCompany.find(
                      (option) => option.companyName === field.value
                    ) || null}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!formState.errors?.companyName}
                        placeholder="Select Company"
                      />
                    )}
                  />
                  {!!formState.errors?.companyName ? (
                    <FormHelperText error>
                      {errors?.companyName?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="companyName"
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
                    color={!!formState.errors?.application ? red[700] : ""}
                  >
                    Application
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.application}
                    placeholder="Application"
                  />
                  {!!formState.errors?.application ? (
                    <FormHelperText error>
                      {errors?.application?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="application"
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
                    color={!!formState.errors?.assignedEmployee ? red[700] : ""}
                  >
                    Assigned Employee
                  </Typography>
                  <Autocomplete
                    {...field}
                    options={employees}
                    getOptionLabel={(option) => option.name || ""}
                    onChange={(e, value) => field.onChange(value ? value.email : "")}
                    value={employees.find(
                      (option) => option.email === field.value
                    ) || null}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!formState.errors?.assignedEmployee}
                        placeholder="Select Employee"
                      />
                    )}
                  />
                  {!!formState.errors?.assignedEmployee ? (
                    <FormHelperText error>
                      {errors?.assignedEmployee?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="assignedEmployee"
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
                    color={!!formState.errors?.description ? red[700] : ""}
                  >
                    Description
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.description}
                    placeholder="Description"
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
            <SubmitButton />
          </Grid>
        </Grid>
      </Box>
      {isLoading && <SpinnerLoading />}
    </>
  );
}

export default UploadProjectModal;
