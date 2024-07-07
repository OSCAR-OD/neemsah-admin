import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import SubmitButton from "../../Form/SubmitButton";
import { red } from "@mui/material/colors";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

// Validation Form
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  assignedTo: Yup.string().required("Assigned To is required"),
  startDate: Yup.string().required("Start Date is required"),
  dueDate: Yup.string().required("Due Date is required"),
  status: Yup.string().required("Status Date is required"),
});

function UploadTaskModal({ handleCancel, handleUploadSubmit }) {
  // react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  // submit data
  const onSubmit = (data) => {
    handleUploadSubmit(data);
  };

  return (
    <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item sm={6} xs={12}>
          <Controller
            render={({ field, formState }) => (
              <FormControl fullWidth variant="outlined">
                <Typography
                  variant="formLabel"
                  color={!!formState.errors?.title ? red[700] : ""}
                >
                Title
                </Typography>
                <TextField
                  {...field}
                  error={!!formState.errors?.title}
                  placeholder="Title"
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
        </Grid>
        <Grid item sm={6} xs={12}>
          <Controller
            render={({ field, formState }) => (
              <FormControl fullWidth variant="outlined">
                <Typography
                  variant="formLabel"
                  color={!!formState.errors?.assignedTo ? red[700] : ""}
                >
                  Assigned To
                </Typography>
                <TextField
                  {...field}
                  error={!!formState.errors?.assignedTo}
                  placeholder="Assigned To"
                />
                {!!formState.errors?.assignedTo ? (
                  <FormHelperText error>
                    {errors?.assignedTo?.message}
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            )}
            name="assignedTo"
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
                  color={!!formState.errors?.startDate ? red[700] : ""}
                >
                  Start Date
                </Typography>
                <TextField
                  {...field}
                  error={!!formState.errors?.startDate}
                  placeholder="Start Date"
                />
                {!!formState.errors?.startDate ? (
                  <FormHelperText error>
                    {errors?.startDate?.message}
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            )}
            name="startDate"
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
                  color={!!formState.errors?.dueDate ? red[700] : ""}
                >
                  Due Date
                </Typography>
                <TextField
                  {...field}
                  error={!!formState.errors?.dueDate}
                  placeholder="Due Date"
                />
                {!!formState.errors?.dueDate ? (
                  <FormHelperText error>
                    {errors?.dueDate?.message}
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            )}
            name="dueDate"
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
                  color={!!formState.errors?.status ? red[700] : ""}
                >
                  Status
                </Typography>
                <TextField
                  {...field}
                  error={!!formState.errors?.status}
                  placeholder="Status"
                />
                {!!formState.errors?.status ? (
                  <FormHelperText error>
                    {errors?.status?.message}
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            )}
            name="status"
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
      </Grid>
      <SubmitButton submitBtnText={"Submit"} onCancelClick={handleCancel} />
    </Box>
  );
}

export default UploadTaskModal;
