import { Avatar, Box } from "@mui/material";
import React from "react";
import { AiOutlinePlayCircle } from "react-icons/ai";

function ImageVideoItem({ type, path, altText }) {
  return (
    <>
      {type === "video" ? (
        <Box sx={{ width: 50, height: 50, position: "relative" }}>
          <Box
            component={"video"}
            src={`${import.meta.env.VITE_APP_ATTACHMENT_URL}/${path}`}
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
        </Box>
      ) : (
        <Avatar
          alt={altText}
          src={`${import.meta.env.VITE_APP_ATTACHMENT_URL}/${path}`}
          variant="rounded"
          sx={{ width: 50, height: 50 }}
        />
      )}
    </>
  );
}

ImageVideoItem.defaultProps = {
  altText: "",
};

export default ImageVideoItem;
