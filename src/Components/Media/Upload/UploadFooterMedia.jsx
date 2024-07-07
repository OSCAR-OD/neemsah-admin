import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import SubmitButton from "../../Form/SubmitButton";
import { red } from "@mui/material/colors";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { getApiHandler } from "../../../lib/axios/ApiHelper";

// Validation Schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  slug: Yup.string().required("Slug is required"),
  checkboxes: Yup.array().min(1, "At least one checkbox must be selected"),
  grandParentSelect: Yup.string().when('checkboxes', {
    is: (checkboxes) => Array.isArray(checkboxes) && (checkboxes.includes('parent') || checkboxes.includes('grandChild')),
    then: (schema) => schema.required("Grand Parent selection is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  parentSelect: Yup.string().when('checkboxes', {
    is: (checkboxes) => Array.isArray(checkboxes) && checkboxes.includes('grandChild'),
    then: (schema) => schema.required("Parent selection is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

function UploadIndustryMedia({ handleCancel, handleUploadSubmit }) {
  const [grandParentOptions, setGrandParentOptions] = useState([]);
  const [parentOptions, setParentOptions] = useState([]);
  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const getGrandParent = async () => {
    return await getApiHandler("/admin/footer/getGrandParent");
  };

  const getChildrenOfGrandParent = async (grandParentId) => {
    return await getApiHandler(`/admin/footer/childrenOfGrandParent/${grandParentId}`);
  };

  const getMedia = async () => {
    const res = await getGrandParent();
    //console.log("API Response:", res);
    if (res?.success) {
      setGrandParentOptions(res.data);
    } else {
      //console.error(res?.response?.status === 404 ? "Data not found" : "Something went wrong");
    }
  };

  useEffect(() => {
    getMedia();
  }, []);

  const fetchParentOptions = async (grandParentId) => {
    const res = await getChildrenOfGrandParent(grandParentId);
    if (res?.success) {
      setParentOptions(res.data);
    }
  };

  const onSubmit = (data) => {
    handleUploadSubmit(data);
  };

  const selectedOptions = watch("checkboxes", []);
  const selectedGrandParent = watch("grandParentSelect", "");

  useEffect(() => {
    if (selectedGrandParent) {
      fetchParentOptions(selectedGrandParent);
    }
  }, [selectedGrandParent]);

  const handleCheckboxChange = (option) => (event) => {
    const updatedOptions = event.target.checked
      ? [...selectedOptions, option]
      : selectedOptions.filter((value) => value !== option);
    setValue("checkboxes", updatedOptions);
  };

  const nameValue = watch("name", "");

  useEffect(() => {
    const slug = nameValue.replace(/ /g, '-').toLowerCase();
    setValue("slug", slug);
  }, [nameValue, setValue]);

  return (
    <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item sm={6} xs={12}>
          <Controller
            render={({ field, formState }) => (
              <FormControl fullWidth variant="outlined">
                <Typography variant="formLabel" color={formState.errors?.name ? red[700] : ""}>
                  Name
                </Typography>
                <TextField {...field} error={!!formState.errors?.name} placeholder="Name" />
                {!!formState.errors?.name && (
                  <FormHelperText error>{errors?.name?.message}</FormHelperText>
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
              <FormControl fullWidth variant="outlined">
                <Typography variant="formLabel" color={formState.errors?.slug ? red[700] : ""}>
                  Slug
                </Typography>
                <TextField {...field} error={!!formState.errors?.slug} placeholder="Slug" />
                {!!formState.errors?.slug && (
                  <FormHelperText error>{errors?.slug?.message}</FormHelperText>
                )}
              </FormControl>
            )}
            name="slug"
            control={control}
            defaultValue=""
          />
        </Grid>
        {/* Checkboxes Section */}
        <Grid item xs={12}>
          <Typography variant="formLabel">Options</Typography>
          <FormControl component="fieldset">
            <Controller
              name="checkboxes"
              control={control}
              defaultValue={[]}
              render={() => (
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedOptions.includes("grandParent")}
                        onChange={handleCheckboxChange("grandParent")}
                      />
                    }
                    label="Grand Parent"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedOptions.includes("parent")}
                        onChange={handleCheckboxChange("parent")}
                      />
                    }
                    label="Parent"
                  />
                </div>
              )}
            />
            {!!errors?.checkboxes && (
              <FormHelperText error>{errors?.checkboxes?.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        {selectedOptions.includes("grandChild") && (
          <>
            <Grid item xs={6}>
              <Controller
                name="grandParentSelect"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.grandParentSelect}>
                    <InputLabel id="select-grand-parent-label">Select Grand Parent</InputLabel>
                    <Select {...field} labelId="select-grand-parent-label" label="Select Grand Parent">
                      <MenuItem value="" disabled>Select value</MenuItem>
                      {grandParentOptions.map((item) => (
                        <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                      ))}
                    </Select>
                    {!!errors.grandParentSelect && (
                      <FormHelperText>{errors.grandParentSelect.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="parentSelect"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.parentSelect}>
                    <InputLabel id="select-parent-label">Select Parent</InputLabel>
                    <Select {...field} labelId="select-parent-label" label="Select Parent">
                      <MenuItem value="" disabled>Select value</MenuItem>
                      {parentOptions.map((item) => (
                        <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                      ))}
                    </Select>
                    {!!errors.parentSelect && (
                      <FormHelperText>{errors.parentSelect.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          </>
        )}
        {selectedOptions.includes("parent") && !selectedOptions.includes("grandChild") && (
          <Grid item xs={6}>
            <Controller
              name="grandParentSelect"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.grandParentSelect}>
                  <InputLabel id="select-grand-parent-label">Select Grand Parent</InputLabel>
                  <Select {...field} labelId="select-grand-parent-label" label="Select Grand Parent">
                    <MenuItem value="" disabled>Select value</MenuItem>
                    {grandParentOptions.map((item) => (
                      <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                    ))}
                  </Select>
                  {!!errors.grandParentSelect && (
                    <FormHelperText>{errors.grandParentSelect.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
        )}
      </Grid>
      {(selectedOptions.includes("grandParent") ||
        selectedOptions.includes("parent") ||
        selectedOptions.includes("grandChild")) && (
        <SubmitButton label="Upload" />
      )}
    </Box>
  );
}

export default UploadIndustryMedia;
