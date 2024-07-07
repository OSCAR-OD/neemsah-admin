import { Button } from "@mui/material";
import React from "react";

function TextButton({
  text,
  variant,
  onClick,
  isStartIcon,
  isEndIcon,
  icon,
  isDisabled,
  isLinkable,
  Path,
  color,
}) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      startIcon={isStartIcon && icon}
      endIcon={isEndIcon && icon}
      disabled={isDisabled}
      sx={{
        fontWeight: 700,
        fontSize: " 12px",
        lineHeight: " 20px",
        textTransform:"none",
        color:   color,
      }}
    >
      {text}{" "}
    </Button>
  );
}

TextButton.defaultProps = {
  text: "Add Button Text",
  variant: "text",
  isStartIcon: false,
  isEndIcon: false,
  isDisabled: false,
  color: "#1DBAFF",

};

export default TextButton;
