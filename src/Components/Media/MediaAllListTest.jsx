import { Avatar, Box, Grid } from "@mui/material";
import React, { useState } from "react";
import SubmitButton from "../Form/SubmitButton";
import { AiOutlinePlayCircle } from "react-icons/ai";
import CustomButton from "../Button/CustomButton";
import { useForm } from "react-hook-form";

function MediaAllListTest({ handleCancel, handleAttachmentsSubmit }) {
  const [uploadMediaData, setuploadMediaData] = useState([
    {
      id: 1,
      image: "/assets/images/no-image-availabe.png",
      isSelected: true,
    },
    {
      id: 2,
      image: "/assets/images/no-image-availabe.png",
      isSelected: false,
    },
    {
      id: 3,
      image: "/assets/images/no-image-availabe.png",
      isVideos: true,
      isSelected: false,
    },
    {
      id: 4,
      image: "/assets/images/no-image-availabe.png",
      isSelected: false,
    },
    {
      id: 5,
      image: "/assets/images/no-image-availabe.png",
      isSelected: false,
    },
    {
      id: 6,
      image: "/assets/images/no-image-availabe.png",
      isVideos: true,
    },
    {
      id: 7,
      image: "/assets/images/no-image-availabe.png",
    },
    {
      id: 8,
      image: "/assets/images/no-image-availabe.png",
    },
    {
      id: 9,
      image: "/assets/images/no-image-availabe.png",
      isVideos: true,
    },
    {
      id: 10,
      image: "/assets/images/no-image-availabe.png",
    },
    {
      id: 11,
      image: "/assets/images/no-image-availabe.png",
    },
    {
      id: 12,
      image: "/assets/images/no-image-availabe.png",
      isVideos: true,
    },
  ]);
  const [storeSeletedAttachment, setStoreSeletedAttachment] = useState([
    {
      id: 1,
      image: "/assets/images/no-image-availabe.png",
      isSelected: false,
    },
    {
      id: 8,
      image: "/assets/images/no-image-availabe.png",
      isSelected: false,
    },
  ]);
 

  //Attachments selected
  const handleSelectedImage = (item, type) => {
 
    if (type === 1) {
      setuploadMediaData(
        uploadMediaData?.map((row) =>
          row?.id === item?.id
            ? { ...row, isSelected: true }
            : { ...row, isSelected: false }
        )
      );
    } else if (type === 0) {
      // setuploadMediaData(
      //   uploadMediaData?.map((row) =>
      //     row?.id === item?.id
      //       ? { ...row, isSelected: !row?.isSelected }
      //       : { ...row }
      //   )
      // );
 
      if (storeSeletedAttachment?.find((row) => row?.id == item?.id)) {
      
        setStoreSeletedAttachment(
          storeSeletedAttachment?.filter((data) => data?.id !== item?.id)
        );
      } else {
         
        setStoreSeletedAttachment((prevValue) => [...prevValue, item]);
      }
    }
  };

  //react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
  });

  //submit attachment
  const onSubmit = (formData) => {
  //  console.log("onSubmit - formData:", formData);
    handleAttachmentsSubmit(uploadMediaData);
  };
 

  return (
    <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ mt: 3 }}>
        <Grid
          container
          //   columns={{ xl: 20, lg: 16, md: 15, sm: 12, xs: 12 }}
          spacing={2}
        >
          {uploadMediaData?.map((item, index) => {
           

            return (
              <Grid
                item
                lg={2}
                sm={3}
                xs={6}
                key={index}
                sx={{ position: "relative" }}
              >
                {item?.id} item id
                <Avatar
                  alt="Upload image"
                  src={item?.image}
                  variant="rounded"
                  sx={{
                    width: 1,
                    height: 150,
                    cursor: "pointer",
                    border: storeSeletedAttachment?.find(
                      (data) => data?.id === item.id
                    )
                      ? "2px solid #4FB5E5"
                      : "",
                    "&:hover": {
                      opacity: 0.8,
                    },
                  }}
                  onClick={() => handleSelectedImage(item, 0)}
                />
                {item?.isVideos && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                    }}
                  >
                    {" "}
                    <AiOutlinePlayCircle size={34} color="#4fb5e5" />{" "}
                  </Box>
                )}
              </Grid>
            );
          })}
        </Grid>
        <Box sx={{ mt: 6, textAlign: "center" }}>
          <CustomButton text={"Load More"} />
        </Box>
      </Box>
      <SubmitButton onCancelClick={handleCancel} />
    </Box>
  );
}

export default MediaAllListTest;
