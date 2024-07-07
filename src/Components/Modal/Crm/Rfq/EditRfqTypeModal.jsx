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
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import SubmitButton from "../../../Form/SubmitButton";
import FileUpload from "../../../Form/FileUpload/FileUpload";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { imageCloseIconStyle } from "../../../CustomStyle/OthersStyle";
import { FaTimes } from "react-icons/fa";
import CustomButton from "../../../Button/CustomButton";
import Modal from "../../Modal";
import ImageVideoModalItem from "../../../Table/ImageVideo/ImageVideoModalItem";
import { toast } from "react-toastify";
import { getApiHandler } from "../../../../lib/axios/ApiHelper";
import SpinnerLoading from "../../../Skeleton/Spinner/SpinnerLoading";

//Validation Form
const validationSchema = Yup.object().shape({
  // mainTitle: Yup.string().required("Title is required"),
  // description: Yup.string().required("Description is required"),
});
function EditRfqTypeModal({
  isEditModal,
  handleFormSubmit,
  handleCancel,
  id,
  fetchPath,
  isShowButtonText,
}) {
  const [isShowMediaModal, setIsShowMediaModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storeSelectedAttachment, setStoreSelectedAttachment] = useState([]);
  //console.log("storeSelectedAttachment:", storeSelectedAttachment);

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
      buttonText: "",
    },
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

  //Select attachments submit
  const handleAttachmentsSubmit = (e, selectedAttachment) => {
    e.preventDefault();
    //console.log("handleAttachmentsSubmit - selectedAttachment:", selectedAttachment);
    uploadMediaHideModal();
    setStoreSelectedAttachment((prev) => [...prev, ...selectedAttachment]);
  };

  //Selected delete
  const handleSelectedDelete = (selectId) => {
    //console.log("handleSelectedDelete - selectId:", selectId);
    setStoreSelectedAttachment(
      storeSelectedAttachment?.filter((item) => item._id !== selectId)
    );
  };

  //Get single media attachments
  const getSingleItem = async () => {
    setIsLoading(true);
    const res = await getApiHandler(`/admin/${fetchPath}/singleRfqType/${id}`);
    //console.log("getSingleMedia - res:", res?.data);
    if (res?.success) {
      const {  rfqType, description } = res?.data;
      setValue("rfqType", rfqType);
      setValue("description", description);
      setStoreSelectedAttachment(images);
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
    if (isEditModal && !isShowButtonText) {
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
                    placeholder="rfqType"
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
                    description
                  </Typography>
                  <TextField
                    {...field}
                    error={!!formState.errors?.description}
                    placeholder="description"
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
        <SubmitButton
          onCancelClick={handleCancel}
          submitBtnText={isEditModal ? "Update" : "Save"}
        />
      </Box>
    </>
  );
}

EditRfqTypeModal.defaultProps = {
  fetchPath: "crm",
  isShowButtonText: false,
};

export default EditRfqTypeModal;
