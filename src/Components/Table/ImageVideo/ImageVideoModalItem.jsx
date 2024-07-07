import { Avatar, Box, IconButton } from "@mui/material";
import React from "react";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { imageCloseIconStyle } from "../../CustomStyle/OthersStyle";
import { FaTimes } from "react-icons/fa";

function ImageVideoModalItem({
  type,
  path,
  altText,
  isShowDeleteIcon,
  handleDelete,
  item,
}) {
  const IMG_URL = "https://api.neemsah.com";
  //const IMG_URL = "http://localhost:5500";
  //const IMG_URL = import.meta.env.VITE_REACT_APP_API_URL;  
  
  return (
    <>
      {type === "video" ? (
        <Box sx={{ width: 1, height: 100, position: "relative" }}>
          <Box
            component={"video"}
            src={`${IMG_URL}/${path}`}
            sx={{ width: 1, height: "100%" }}
          ></Box>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          >
            {" "}
            <AiOutlinePlayCircle size={22} color="#4fb5e5" />{" "}
          </Box>
          {isShowDeleteIcon && (
            <IconButton
              sx={imageCloseIconStyle}
              onClick={() => handleDelete(item?._id)}
            >
              <FaTimes size={14} color="black" />
            </IconButton>
          )}
        </Box>
      ) : (
        <Box sx={{ position: "relative", width: 1, height: 100 }}>
          <Avatar
            alt={altText}
            src={`${IMG_URL}/${path}`}
            variant="rounded"
            sx={{ 
              width: 1,
              height: 150,
              '& > img':{
                objectFit: 'contain',
                height: '100%',
              },
             }}
          />
          {isShowDeleteIcon && (
            <IconButton
              sx={imageCloseIconStyle}
              onClick={() => handleDelete(item?._id)}
            >
              <FaTimes size={14} color="black" />
            </IconButton>
          )}
        </Box>
      )}
    </>
  );
}

ImageVideoModalItem.defaultProps = {
  altText: "",
  isShowDeleteIcon: true,
};

export default ImageVideoModalItem;
