import { Button } from "@mui/material";
import React from "react";

function CustomButton({
  text,
  variant,
  onClick,
  isStartIcon,
  isEndIcon,
  icon,
  isDisabled,
}) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      startIcon={isStartIcon ? icon : null}
      endIcon={isEndIcon ? icon : null}
      disabled={isDisabled}
    >
      {text}
    </Button>
  );
}

CustomButton.defaultProps = {
  text: "Add New",
  variant: "contained",
  isStartIcon: false,
  isEndIcon: false,
  isDisabled: false,
};

export default CustomButton;
