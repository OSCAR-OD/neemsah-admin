import styled from "@emotion/styled";
import { FormControlLabel, Switch, Typography } from "@mui/material";
import React from "react";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 44,
  height: 28,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "white",
      boxShadow: "0px 1px 4px rgba(13, 12, 17, 0.2)",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#4FB5E5",
        opacity: 1,
        border: 0,
      },

      "& .MuiSwitch-thumb": {
        "&::before": {
          background: "#4FB5E5",
        },
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid white",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    position: "relative",
    boxSizing: "border-box",
    width: 23,
    height: 23,
    "&::before": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: " 50%",
      transform: "translate(-50%, -50%)",
      width: "8px",
      height: "8px",
      background: "#A6ACB8",
      borderRadius: "100%",
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#A6ACB8" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

function SwitchBox({onChange,label,isChecked,isShowLabel}) {
  return (
    <FormControlLabel
      control={<IOSSwitch checked={isChecked} onChange={onChange} sx={{m:0}}/>}
      label={
        isShowLabel &&
        <Typography
          variant="h5"
          sx={{
            fontWeight: "600",
            fontSize: "14px",
            lineHeight: "20px",
            letterSpacing: "-0.01em",
            color: "#31384A",
            ml: 2,
          }}
        >
          {label}
        </Typography>
      }
      sx={{m:0}}
    />
  );
}

SwitchBox.defaultProps={
    label:"Switch Label",
    isChecked:false,
    isShowLabel:true,
}

export default SwitchBox;
