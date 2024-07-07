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
import { getApiHandler } from "../../../lib/axios/ApiHelper";
import CustomButton from "../../Button/CustomButton";
import SubmitButton from "../../Form/SubmitButton";
import MediaAllList from "../../Media/MediaAllList";
import SpinnerLoading from "../../Skeleton/Spinner/SpinnerLoading";
import ImageVideoModalItem from "../../Table/ImageVideo/ImageVideoModalItem";
import Modal from "../Modal";
import TextEditor from "../../Editor/TextEditor";

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

function BlogManageModal({
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

  //Select attachments submit
  const handleAttachmentsSubmit = (e, selectedAttachment) => {
//    console.log(      "handleAttachmentsSubmit - selectedAttachment:",  selectedAttachment);
    e.preventDefault();
    uploadMediaHideModal();
    if (isMultiple) {
      setStoreSelectedAttachment((prev) => [...prev, ...selectedAttachment]);
    } else {
      setStoreSelectedAttachment(selectedAttachment);
    }
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
        onSubmit={handleSubmit((data) =>
          handleFormSubmit(data, storeSelectedAttachment, value,editorContent)
        )}
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
                    Title
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
                    color={!!formState.errors?.subTitle ? red[700] : ""}
                  >
                    Sub Title
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.subTitle}
                    placeholder="Sub Title"
                  />
                  {!!formState.errors?.subTitle ? (
                    <FormHelperText error>
                      {errors?.subTitle?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="subTitle"
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
                    color={!!formState.errors?.author ? red[700] : ""}
                  >
                    Author
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.author}
                    placeholder="Author"
                  />
                  {!!formState.errors?.author ? (
                    <FormHelperText error>
                      {errors?.author?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="author"
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
                    // color={!!formState.errors?.keyWords ? red[700] : ""}
                  >
                    KeyWords
                  </Typography>
                  {/* <TextField
                    {...field}
                    error={!!formState.errors?.keyWords}
                    placeholder="KeyWords"
                  /> */}
                  <Autocomplete
                    //  {...field}
                    value={value}
                    onChange={(event, newValue) => {
                     // console.log("newValue onchange:", newValue);
                      reactHookValue("keyWords", newValue);
                      if (typeof newValue === "string") {
                       // console.log("newValue: 1");
                        setValue([
                          ...value,
                          {
                            title: newValue,
                          },
                        ]);
                      } else if (newValue && newValue.inputValue) {
                        // console.log("newValue: 2");
                        // Create a new value from the user input
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
                        placeholder="Enter Keywords"
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
          <Grid item sm={6} xs={12}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Controller
                render={({ field, formState }) => (
                  <FormControl fullWidth variant="outlined">
                    <Typography
                      variant="formLabel"
                      color={!!formState.errors?.date ? red[700] : ""}
                    >
                      Published Date
                    </Typography>

                    <DatePicker
                      error={!!formState.errors?.date}
                      format="DD/MM/YYYY"
                      fullWidth
                      {...field}
                      value={field?.value ? moment.utc(field?.value) : null}
                      slotProps={{
                        textField: {
                          error: errors?.date ? true : false,
                        },
                      }}
                    />

                    {!!formState.errors?.date ? (
                      <FormHelperText error>
                        {errors?.date?.message}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                )}
                name="date"
                control={control}
                defaultValue=""
              />
            </LocalizationProvider>
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

          <Grid item xs={12}>
            <TextEditor
              editorContent={editorContent}
              setEditorContent={setEditorContent}
            />
            {/* <Controller
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
                    multiline
                    minRows={4}
                    maxRows={12}
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
            /> */}
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mt: 3, mb: 6, textAlign: "center" }}>
              <CustomButton
                text={"Select Image"}
                variant={"outlined"}
                onClick={uploadMediaShowModal}
              />
            </Box>
            {isLoading ? (
              <SpinnerLoading />
            ) : (
              <Grid container spacing={2}>
                {storeSelectedAttachment?.length > 0
                  ? storeSelectedAttachment?.map((item, index) => {
                      return (
                        <Grid item lg={2} sm={3} xs={4} key={item?._id}>
                          <ImageVideoModalItem
                            type={item?.type}
                            path={item?.path}
                            altText={item?.caption}
                            item={item}
                            handleDelete={handleSelectedDelete}
                          />
                        </Grid>
                      );
                    })
                  : isEditModal && (
                      <Typography variant="formTitle" align="center" width={1}>
                        No image select yet{" "}
                      </Typography>
                    )}
              </Grid>
            )}
          </Grid>
        </Grid>
        <SubmitButton
          onCancelClick={handleCancel}
          submitBtnText={isEditModal ? "Update" : "Save"}
        />
      </Box>
      {/* All Media  */}
      <Modal
        isShowModal={isShowMediaModal}
        title={"Select Attachments"}
        handleCloseModal={uploadMediaHideModal}
        width={"1200px"}
      >
        <MediaAllList
          handleCancel={uploadMediaHideModal}
          handleAttachmentsSubmit={handleAttachmentsSubmit}
          attachmentType="image"
          selectType={attachmentSelect}
          previousSelectedImage={storeSelectedAttachment?.map(
            (item) => item?._id
          )}
        />
      </Modal>
    </>
  );
}

BlogManageModal.defaultProps = {
  isMultiple: false,
  singleFetchPath: "blog",
  attachmentSelect: 1,
};

export default BlogManageModal;
