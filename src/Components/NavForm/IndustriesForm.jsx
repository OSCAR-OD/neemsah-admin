import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import {
  Autocomplete,
  Box,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { getApiHandler } from "../../lib/axios/ApiHelper";
import CustomButton from "../Button/CustomButton";
import SubmitButton from "../Form/SubmitButton";
import MediaAllList from "../Media/MediaAllList";
import SpinnerLoading from "../Skeleton/Spinner/SpinnerLoading";
import ImageVideoModalItem from "../Table/ImageVideo/ImageVideoModalItem";
import Modal from "../Modal/Modal";
import TextEditor from "../Editor/TextEditor";

//Validation Form
const validationSchema = Yup.object().shape({
  mainTitle: Yup.string().required("Title is required"),
  subTitle: Yup.string(),
  author: Yup.string(),
  // keyWords: Yup.array().required("Keywords is required"),
  // description: Yup.string().required("Description is required"),
  date: Yup.string().required("Date is required"),
  buttonLink: Yup.string().nullable().required("Slug is required"),
});

const filter = createFilterOptions();

function IndustriesForm({
  isEditModal,
  handleFormSubmit,
  handleCancel,
  id,
  singleFetchPath,
  attachmentSelect,
  isMultiple,
}) {
  const [isShowMediaModal, setIsShowMediaModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storeSelectedAttachment, setStoreSelectedAttachment] = useState([]);
 // console.log("storeSelectedAttachment:", storeSelectedAttachment);
  const [value, setValue] = useState([]);
  const [editorContent, setEditorContent] = useState("");
 // console.log("editorContent:", editorContent);

  //react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue: reactHookValue,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  //?All Media Modal
  //Show Upload modal
  const uploadMediaShowModal = () => {
    setIsShowMediaModal(true);
  };
  //Hide Upload modal
  const uploadMediaHideModal = () => {
    setIsShowMediaModal(false);
  };

  //Selected delete
  const handleSelectedDelete = (selectId) => {
    setStoreSelectedAttachment(
      storeSelectedAttachment?.filter((item) => item._id !== selectId)
    );
  };


  //Get single media attachments
  const getSingleItem = async () => {
    setIsLoading(true);
    const res = await getApiHandler(`/admin/${singleFetchPath}/single/${id}`);
    if (res?.success) {
     // console.log( moment.utc(res?.data.publishedDate, "YYYY-MM-DD"),        "getSingleItem - res:", res );
      const {
        title,
        author,
        slug,
        subTitle,
        description,
        image,
        images,
        keyWords,
        publishedDate,
      } = res?.data;
      reactHookValue("mainTitle", title);
      reactHookValue("subTitle", subTitle);
      setEditorContent(description);
      reactHookValue("buttonLink", slug);
      reactHookValue("author", author);
      reactHookValue("date", moment.utc(publishedDate, "YYYY-MM-DD"));
      setValue(keyWords);
      setStoreSelectedAttachment(isMultiple ? images : [image]);
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data not found");
      } else {
        toast.warn("Something went wrong");
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isEditModal) {
      getSingleItem();
    }
  }, [id]);

  return (
    <>
      <Box
        component={"form"}
        onSubmit={handleSubmit((data) => {
            console.log("Form Data:", data);
         // handleFormSubmit(data, storeSelectedAttachment, value,editorContent);
        })}
      >
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <Controller
              render={({ field, formState }) => (
                <FormControl fullWidth variant="outlined">
                  <Typography
                    variant="formLabel"
                    color={!!formState.errors?.mainTitle ? red[700] : ""}
                  >
                    Industry Name
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.mainTitle}
                    placeholder="Title"
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
          </Grid>
          <Grid item sm={6} xs={12}>
            <Controller
              render={({ field, formState }) => (
                <FormControl fullWidth variant="outlined">
                  <Typography
                    variant="formLabel"
                    color={!!formState.errors?.buttonLink ? red[700] : ""}
                  >
                    Slug
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.buttonLink}
                    placeholder="Slug"
                  />
                  {!!formState.errors?.buttonLink ? (
                    <FormHelperText error>
                      {errors?.buttonLink?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="buttonLink"
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
                    color={!!formState.errors?.keyWords ? red[700] : ""}
                  >
                    Sub Category
                  </Typography>
                  <Autocomplete
                    //  {...field}
                    value={value}
                    onChange={(event, newValue) => {
                      reactHookValue("keyWords", newValue);
                      if (typeof newValue === "string") {
                        setValue([
                          ...value,
                          {
                            title: newValue,
                          },
                        ]);
                      } else if (newValue && newValue.inputValue) {
                        setValue([
                          ...value,
                          {
                            title: newValue,
                          },
                        ]);
                      } else {
                       // console.log("newValue: 3");
                        setValue(newValue);
                      }
                    }}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);
                     // console.log("filtered:", filtered);

                      const { inputValue } = params;
                      // Suggest the creation of a new value
                      const isExisting = options.some(
                        (option) => inputValue === option.title
                      );
                      if (inputValue !== "" && !isExisting) {
                        filtered.push({
                          inputValue,
                          title: `Add "${inputValue}"`,
                        });
                      }

                      return filtered;
                    }}
                    PopperComponent={""}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    id="free-solo-with-text-demo"
                    options={[]}
                    getOptionLabel={(option) => {
                      // Value selected with enter, right from the input
                      if (typeof option === "string") {
                        return option;
                      }
                      // Add "xxx" option created dynamically
                      if (option.inputValue) {
                        return option.inputValue;
                      }
                      // Regular option
                      return option.title;
                    }}
                    renderOption={(props, option) => (
                      <li {...props}>{option.title}</li>
                    )}
                    // sx={{ width: 300 }}
                    freeSolo
                    multiple
                    fullWidth
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Enter Sub Categories"
                        fullWidth
                        // error={!!formState.errors?.keyWords}
                      />
                    )}
                  />
                  {/* {!!formState.errors?.keyWords ? (
                    <FormHelperText error>
                      {errors?.keyWords?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )} */}
                </FormControl>
              )}
              name="keyWords"
              control={control}
              defaultValue={""}
            />
          </Grid>
        </Grid>
        <SubmitButton
          onCancelClick={handleCancel}
          submitBtnText={isEditModal ? "Update" : "Save"}
        />
      </Box>
    </>
  );
}

IndustriesForm.defaultProps = {
  isMultiple: false,
  singleFetchPath: "blog",
  attachmentSelect: 1,
};

export default IndustriesForm;
