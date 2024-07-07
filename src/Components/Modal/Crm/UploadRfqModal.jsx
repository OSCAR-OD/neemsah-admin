import React from "react";
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import SubmitButton from "../../Form/SubmitButton";
import { red } from "@mui/material/colors";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import CreatableSelect from "react-select/creatable";

// Validation Schema
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

  // Options for the Creatable Select
  const rfqFormatOptions = [
    { value: "Quotation", label: "Quotation" },
    { value: "PI", label: "PI" },
    { value: "LC", label: "LC" },
  ];

  return (
    <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item sm={6} xs={12}>
          <Controller
            name="rfqType"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <FormControl fullWidth variant="outlined">
                <Typography
                  variant="formLabel"
                  color={!!errors.rfqType ? red[700] : ""}
                >
                  RFQ Type
                </Typography>
                <TextField
                  {...field}
                  error={!!errors.rfqType}
                  placeholder="RFQ Type"
                />
                {!!errors.rfqType ? (
                  <FormHelperText error>
                    {errors.rfqType.message}
                  </FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <Controller
            name="rfqFormat"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <FormControl fullWidth variant="outlined">
                <Typography
                  variant="formLabel"
                  color={!!errors.rfqFormat ? red[700] : ""}
                >
                  RFQ Format
                </Typography>
                <CreatableSelect
                  {...field}
                  options={rfqFormatOptions}
                  isClearable
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption ? selectedOption.value : "");
                  }}
                  value={
                    rfqFormatOptions
                      ? rfqFormatOptions.find(
                        (option) => option.value === field.value
                      )
                      : ""
                  }
                />
                {!!errors.rfqFormat ? (
                  <FormHelperText error>
                    {errors.rfqFormat.message}
                  </FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <FormControl fullWidth variant="outlined">
                <Typography
                  variant="formLabel"
                  color={!!errors.description ? red[700] : ""}
                >
                  Description
                </Typography>
                <TextField
                  {...field}
                  error={!!errors.description}
                  placeholder="Description"
                />
                {!!errors.description ? (
                  <FormHelperText error>
                    {errors.description.message}
                  </FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
      <SubmitButton submitBtnText={"Submit"} onCancelClick={handleCancel} />
    </Box>
  );
}

export default UploadRfqModal;
