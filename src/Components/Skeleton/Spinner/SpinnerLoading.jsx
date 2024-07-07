import { Box, CircularProgress } from "@mui/material";
import React from "react";

function SpinnerLoading({ height, color, mt }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: mt,
        height: height,
      }}
    >
      <CircularProgress color={color} />
    </Box>
  );
}

SpinnerLoading.defaultProps = {
  height: "auto",
  color: "primary",
  mt: 2,
};

export default SpinnerLoading;
