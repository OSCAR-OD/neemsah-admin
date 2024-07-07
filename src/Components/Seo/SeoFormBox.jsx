import { Box, FormControl, Paper, TextField, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import SubmitButton from "../Form/SubmitButton";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getApiHandler, postApiHandler } from "../../lib/axios/ApiHelper";

//Validation Form
const validationSchema = Yup.object().shape({
  mainTitle: Yup.string(),
  description: Yup.string(),
});

function SeoFormBox({ position }) {
  // const [{ isLoading, isError, errorMessage, fetchData }, dispatch] =
  // useReducer(fetchReducer, initialFetchData);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isEditSeo, setIsEditSeo] = useState(true);
  const [seoDataList, setSeoDataList] = useState([]);
  // console.log(
  //   Object.keys(seoDataList)?.length,
  //   "SeoFormBox - seoDataList:",
  //   seoDataList
  // );

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
  });

  //Seo submit
  const handleSeoSubmit = async (data) => {
    const getFormValues = getValues(["mainTitle", "description"]);
    // console.log(
    //   getFormValues[0]?.length,
    //   "handleSeoSubmit - getFormValues:",
    //   getFormValues
    // );
    if (getFormValues[0]?.length > 0 || getFormValues[1]?.length > 0) {
      const res = await postApiHandler(
        isEditSeo
          ? `/admin/seo/edit/${seoDataList?.customID}`
          : `/admin/seo/add`,
        {
          metaTitle: data?.mainTitle || "",
          metaDescription: data?.description || "",
          position: position,
        }
      );

      if (res?.success) {
        setShouldFetch((prev) => !prev);
        toast.success("Meta data saved");
      } else {
        if (res?.response?.status === 404) {
          toast.warn("Data not found");
        } else {
          toast.warn("Something went wrong");
        }
      }
    } else {
      toast.info("Please add text first");
    }
  };

  //Get all media attachments
  const getMedia = async () => {
    const res = await getApiHandler("/admin/seo/all", {
      position: position,
    });
    if (res?.success) {
      const dataFormat = res.data[0];
    //  console.log(res?.data?.length, "getMedia - dataFormat:", dataFormat);
      if (res?.data?.length > 0) {
        setIsEditSeo(true);
        setSeoDataList(dataFormat);
        setValue("mainTitle", dataFormat?.metaTitle);
        setValue("description", dataFormat?.metaDescription);
      } else {
        setSeoDataList([]);
        setIsEditSeo(false);
      }
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data not found");
      } else {
        toast.warn("Something went wrong");
      }
      setSeoDataList([]);
    }
  };

  useEffect(() => {
    getMedia();
  }, [shouldFetch]);

  return (
    <Box sx={{ maxWidth: 900, width: 1, mx: "auto" }}>
      <Typography variant="modalInnerTitle" sx={{ mb: 2 }}>
        SEO
      </Typography>
      <Paper
        sx={{
          py: { sm: 3, xs: 2 },
          px: { sm: 3, xs: 1 },
        }}
      >
        <Box component={"form"} onSubmit={handleSubmit(handleSeoSubmit)}>
          <Controller
            render={({ field, formState }) => (
              <FormControl fullWidth variant="outlined">
                <Typography
                  variant="formLabel"
                  color={!!formState.errors?.mainTitle ? red[700] : ""}
                >
                  Title
                </Typography>
                <TextField
                  {...field}
                  error={!!formState.errors?.mainTitle}
                  placeholder="Meta Title"
                />
                {!!formState.errors?.mainTitle ? (
                  <FormHelperText error>
                    {errors?.mainTitle?.message}
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            )}
            name="mainTitle"
            control={control}
            defaultValue=""
          />
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
                  placeholder="Description"
                  multiline
                  minRows={3}
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
          <SubmitButton isShowCancelBtn={false} />
        </Box>
      </Paper>
    </Box>
  );
}

SeoFormBox.defaultProps = {
  position: "",
};

export default SeoFormBox;
