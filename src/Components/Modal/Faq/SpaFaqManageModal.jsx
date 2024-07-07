import {
  Avatar,
  Box,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { red } from "@mui/material/colors";
import * as Yup from "yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import SubmitButton from "../../Form/SubmitButton";
import FileUpload from "../../Form/FileUpload/FileUpload";
import { AiOutlinePlayCircle, AiOutlinePlus } from "react-icons/ai";
import { imageCloseIconStyle } from "../../CustomStyle/OthersStyle";
import { FaTimes } from "react-icons/fa";
import CustomButton from "../../Button/CustomButton";
import Modal from "../Modal";
import MediaAllList from "../../Media/MediaAllList";
import { v4 as uuidv4 } from "uuid";
import SpinnerLoading from "../../Skeleton/Spinner/SpinnerLoading";
import { getApiHandler } from "../../../lib/axios/ApiHelper";
import { toast } from "react-toastify";
import ImageVideoModalItem from "../../Table/ImageVideo/ImageVideoModalItem";

//Validation Form
const validationSchema = Yup.object().shape({
  ritualsList: Yup.array().of(
    Yup.object().shape({
      question: Yup.string().required("Question is required"),
      answer: Yup.string(),
    })
  ),
});

function SpaFaqManageModal({
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
  const [storeRitualsList, setStoreRitualsList] = useState([]);
  const [storeSelectedAttachment, setStoreSelectedAttachment] = useState([]);
  // console.log("storeSelectedAttachment:", storeSelectedAttachment);
  // console.log("storeRitualsList:", storeRitualsList);

  //react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      ritualsList: [{ question: "", answer: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ritualsList",
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

  //Add rituals  list
  const handleAddList = () => {
    append({ question: "", answer: "" });
  };

  //Selected delete
  const handleSelectedDelete = (selectId) => {
    setStoreSelectedAttachment(
      storeSelectedAttachment?.filter((item) => item._id !== selectId)
    );
  };

  //Select attachments submit
  const handleAttachmentsSubmit = (e, selectedAttachment) => {
    // console.log(
    //   "handleAttachmentsSubmit - selectedAttachment:",
    //   selectedAttachment
    // );
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
     // console.log("getSingleItem - res:", res);
      const { faq, image, images } = res?.data;
      setValue("ritualsList", faq);
      setStoreSelectedAttachment(isMultiple ? images : [image]);
    } else {
      if (res?.response?.status === 404) {
        toast.warn("Data not found");
      }
      // else {
      //   toast.warn("Something went wrong");
      // }
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
          handleFormSubmit(data, storeSelectedAttachment)
        )}
      >
        <Grid container spacing={2}>
          {isEditModal && isLoading ? (
            <Box sx={{ mt: 3, textAlign: "center", width: 1 }}>
              <SpinnerLoading />
            </Box>
          ) : (
            <>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item sm={5} xs={12}>
                    <Typography variant="formLabel">Question</Typography>
                  </Grid>
                  <Grid item sm={6} xs={10}>
                    <Typography variant="formLabel">Answer</Typography>
                  </Grid>
                </Grid>
                {fields?.length > 0 ? (
                  fields?.map((row, index) => {
                    return (
                      <Grid
                        container
                        spacing={1}
                        alignItems={"start"}
                        sx={{ mb: 1 }}
                        key={row?._id}
                      >
                        <Grid item sm={5} xs={12}>
                          <Controller
                            render={({ field, formState }) => (
                              <FormControl fullWidth variant="outlined">
                                <TextField
                                  {...field}
                                  error={
                                    Object.keys(formState?.errors).length > 0
                                      ? !!formState?.errors?.ritualsList[index]
                                          ?.question
                                      : false
                                  }
                                  placeholder="Enter Question"
                                />

                                {Object.keys(formState?.errors).length > 0 &&
                                !!formState?.errors?.ritualsList[index]
                                  ?.question ? (
                                  <FormHelperText error>
                                    {
                                      formState?.errors?.ritualsList[index]
                                        ?.question?.message
                                    }
                                  </FormHelperText>
                                ) : (
                                  ""
                                )}
                              </FormControl>
                            )}
                            name={`ritualsList.${index}.question`}
                            control={control}
                            defaultValue=""
                          />
                        </Grid>
                        <Grid item sm={6} xs={10}>
                          <Controller
                            render={({ field, formState }) => (
                              <FormControl fullWidth variant="outlined">
                                <TextField
                                  {...field}
                                  error={
                                    Object.keys(formState?.errors).length > 0
                                      ? !!formState?.errors?.ritualsList[index]
                                          ?.answer
                                      : false
                                  }
                                  placeholder="Enter Answer"
                                  multiline
                                  minRows={3}
                                  maxRows={6}
                                />
                                {Object.keys(formState?.errors).length > 0 &&
                                !!formState?.errors?.ritualsList[index]
                                  ?.answer ? (
                                  <FormHelperText error>
                                    {
                                      formState?.errors?.ritualsList[index]
                                        ?.answer?.message
                                    }
                                  </FormHelperText>
                                ) : (
                                  ""
                                )}
                              </FormControl>
                            )}
                            name={`ritualsList.${index}.answer`}
                            control={control}
                            defaultValue=""
                          />
                        </Grid>
                        {fields?.length > 1 && (
                          <Grid item sm={1} xs={1} sx={{ textAlign: "end" }}>
                            <IconButton
                              sx={{ border: "1px solid #c4c4c4" }}
                              onClick={() => remove(index)}
                            >
                              <FaTimes size={17} />
                            </IconButton>
                          </Grid>
                        )}
                      </Grid>
                    );
                  })
                ) : (
                  <Typography
                    variant="formTitle"
                    align="center"
                    width={1}
                    mt={3}
                  >
                    No list create yet{" "}
                  </Typography>
                )}

                <Box sx={{ mt: 3 }}>
                  <CustomButton
                    isStartIcon={true}
                    icon={<AiOutlinePlus />}
                    onClick={handleAddList}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mt: 3, mb: 6, textAlign: "center" }}>
                  <CustomButton
                    text={"Select Image"}
                    variant={"outlined"}
                    onClick={uploadMediaShowModal}
                  />
                </Box>

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
                        <Typography
                          variant="formTitle"
                          align="center"
                          width={1}
                        >
                          No image select yet{" "}
                        </Typography>
                      )}
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
        <SubmitButton onCancelClick={handleCancel} submitBtnText={"Save"} />
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

SpaFaqManageModal.defaultProps = {
  isMultiple: false,
  singleFetchPath: "spa-faq",
  attachmentSelect: 1,
};

export default SpaFaqManageModal;
