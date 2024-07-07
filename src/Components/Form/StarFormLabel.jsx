import { Box } from "@mui/material";
import React from "react";

function StarFormLabel() {
  return (
    <Box
      component={"span"}
      sx={{
        color: "#da1d1d",
        display: "inline-block",
        position: "relative",
        top: "2px",
        left: "5px",
      }}
    >
       *
    </Box>
  );
}

export default StarFormLabel;
