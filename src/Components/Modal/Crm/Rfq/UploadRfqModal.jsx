import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import SubmitButton from "../../../Form/SubmitButton";
import { red } from "@mui/material/colors";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

// Validation Form
const validationSchema = Yup.object().shape({
  rfqType: Yup.string().required("RFQ Type is required"),
  description: Yup.string().required("Description is required"),
});

function UploadRfqModal({ handleCancel, handleUploadSubmit }) {
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
                  color={!!formState.errors?.rfqType ? red[700] : ""}
                >
                RFQ Type
                </Typography>
                <TextField
                  {...field}
                  error={!!formState.errors?.rfqType}
                  placeholder="RFQ Type"
                />
                {!!formState.errors?.rfqType ? (
                  <FormHelperText error>
                    {errors?.rfqType?.message}
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            )}
            name="rfqType"
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

export default UploadRfqModal;
