import { Typography } from "@mui/material";
import React from "react";

function HeaderTitle({ text, variant }) {
  return (
    <Typography
      variant= {variant}
      sx={{
        fontWeight: 600,
        fontSize:{xs:"16px",sm:"20px"} ,
        lineHeight: "24px",
        color: "#0D0C11",
      }}
    >
      {text}

    </Typography>
  );
}

HeaderTitle.defaultProps = {
  text:"",
  variant:"h3",
}

export default HeaderTitle;
