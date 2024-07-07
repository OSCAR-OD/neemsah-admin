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
 
});

function SpaGalleryManageModal({
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

SpaGalleryManageModal.defaultProps = {
  isMultiple: true,
  singleFetchPath: "spa-gallery",
  attachmentSelect: 0,
};

export default SpaGalleryManageModal;
