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
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import SubmitButton from "../../Form/SubmitButton";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { imageCloseIconStyle } from "../../CustomStyle/OthersStyle";
import { FaTimes } from "react-icons/fa";
import CustomButton from "../../Button/CustomButton";
import Modal from "../Modal";
import MediaAllList from "../../Media/List/MediaCustList";
import ImageVideoModalItem from "../../Table/ImageVideo/ImageVideoModalItem";
import { toast } from "react-toastify";
import { getApiHandler } from "../../../lib/axios/ApiHelper";
import SpinnerLoading from "../../Skeleton/Spinner/SpinnerLoading";

// Validation Form
const validationSchema = Yup.object().shape({
  contactName: Yup.string().required("Contact Name is required"),
  companyName: Yup.string().nullable().notRequired().min(1),
  designation: Yup.string().required("Designation is required"),
  contactEmail: Yup.string().required("Contact's Email is required"),
  contactPhone: Yup.string().required("Contact's Phone No. is required"),
  note: Yup.string().required("Note is required"),
});

function UploadContactModal({
  isEditModal,
  handleFormSubmit,
  handleCancel,
  id,
  fetchPath,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [customerCompany, setCustomerCompany] = useState([]);
  // react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {},
  });

  const getCustomerCompany = async () => {
    return await getApiHandler("/admin/crm/allCustomers");
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
    //console.log("API Response:", res);
    if (res?.success) {
      setCustomerCompany(res.data);
    } else {
      //console.error(res?.response?.status === 404 ? "Data not found" : "Something went wrong");
    }
  };

  useEffect(() => {
    getCustomer();
  }, []);

  useEffect(() => {
    if (isEditModal) {
      getSingleItem();
    }
  }, [id]);

  return (
    <>
      <Box component={"form"} onSubmit={handleSubmit((data) => handleFormSubmit(data))}>
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <Controller
              render={({ field, formState }) => (
                <FormControl fullWidth variant="outlined">
                  <Typography
                    variant="formLabel"
                    color={!!formState.errors?.contactName ? red[700] : ""}
                  >
                    Contact Name
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.contactName}
                    placeholder="Contact Name"
                  />
                  {!!formState.errors?.contactName ? (
                    <FormHelperText error>
                      {errors?.contactName?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="contactName"
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
                    value={customerCompany.find((option) => option.companyName === field.value) || null}
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
            <Controller
              name="customID"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  type="hidden"
                />
              )}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <Controller
              render={({ field, formState }) => (
                <FormControl fullWidth variant="outlined">
                  <Typography
                    variant="formLabel"
                    color={!!formState.errors?.contactPhone ? red[700] : ""}
                  >
                    Contact Phone
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.contactPhone}
                    placeholder="Contact Phone"
                  />
                  {!!formState.errors?.contactPhone ? (
                    <FormHelperText error>
                      {errors?.contactPhone?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="contactPhone"
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
                    color={!!formState.errors?.contactEmail ? red[700] : ""}
                  >
                    Contact Email
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.contactEmail}
                    placeholder="Contact Email"
                  />
                  {!!formState.errors?.contactEmail ? (
                    <FormHelperText error>
                      {errors?.contactEmail?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="contactEmail"
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
                    color={!!formState.errors?.designation ? red[700] : ""}
                  >
                    Designation
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.designation}
                    placeholder="Designation"
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
                <FormControl fullWidth variant="outlined">
                  <Typography
                    variant="formLabel"
                    color={!!formState.errors?.note ? red[700] : ""}
                  >
                    Note
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.note}
                    placeholder="Note"
                  />
                  {!!formState.errors?.note ? (
                    <FormHelperText error>
                      {errors?.note?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="note"
              control={control}
              defaultValue=""
            />
          </Grid>
        </Grid>
        <SubmitButton onCancelClick={handleCancel} submitBtnText={isEditModal ? "Update" : "Save"} />
      </Box>
    </>
  );
}

UploadContactModal.defaultProps = {
  fetchPath: "crm",
};

export default UploadContactModal;
