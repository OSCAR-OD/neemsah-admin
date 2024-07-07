import { Autocomplete, Box, FormControl, FormHelperText, Grid, TextField, Typography, createFilterOptions } from "@mui/material";
import React, { useEffect, useState } from "react";
import { postApiHandler } from "../../lib/axios/ApiHelper";
import SubmitButton from "../Form/SubmitButton";
import { red } from "@mui/material/colors";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

const validationSchema = Yup.object().shape({
  industryName: Yup.string(),
  slug: Yup.string(),
});
const filter = createFilterOptions();

function IndForm({ handleCancel }) {
  const [value, setValue] = useState([]);
  const { control, 
    handleSubmit, 
    formState: { errors },
    setValue: reactHookValue,
   } 
  = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const res = await postApiHandler("/admin/navbar/add", {
        industryName: data?.industryName,
        slug: data?.slug,
        category: data?.category,
      });
    } catch (error) {
      console.error("Error:", error);
    }
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
                   color={!!formState.errors?.industryName ? red[700] : ""}
                 >
                   Industry Name
                 </Typography>
                 <TextField
                   {...field}
                   error={!!formState.errors?.industryName}
                   placeholder="Title"
                 />
                 {!!formState.errors?.industryName ? (
                   <FormHelperText error>
                     {errors?.industryName?.message}
                   </FormHelperText>
                 ) : (
                   ""
                 )}
               </FormControl>
             )}
             name="industryName"
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
                   color={!!formState.errors?.slug ? red[700] : ""}
                 >
                   Slug
                 </Typography>
                 <TextField
                   {...field}
                   error={!!formState.errors?.slug}
                   placeholder="Slug"
                 />
                 {!!formState.errors?.slug ? (
                   <FormHelperText error>
                     {errors?.slug?.message}
                   </FormHelperText>
                 ) : (
                   ""
                 )}
               </FormControl>
             )}
             name="slug"
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
                  color={!!formState.errors?.category ? red[700] : ""}
                >
                  Category
                </Typography>
                <Autocomplete
                  {...field}
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                    reactHookValue("category", Array.isArray(newValue) ? newValue.map(option => option.inputValue || option) : []);
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    const { inputValue } = params;
                    const isExisting = options.some((option) => inputValue === option);
                    if (inputValue !== "" && !isExisting) {
                      filtered.push(inputValue);
                    }
                    return filtered;
                  }}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  id="free-solo-with-text-demo"
                  options={[]}
                  freeSolo
                  multiple
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Enter Categories"
                      fullWidth
                    />
                  )}
                />
                {!!formState.errors?.category && (
                  <FormHelperText error>
                    {errors?.category?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
            name="category"
            control={control}
            defaultValue=""
          />
        </Grid>
      </Grid>
      <SubmitButton submitBtnText={"Submit"} onCancelClick={handleCancel} />
    </Box>
  );
}

export default IndForm;