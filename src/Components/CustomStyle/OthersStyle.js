//Form box container style
export const BoxFormSubmitStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: "calc(100vh - 140px )",
};

//Payment card style
export const paymentCardStyle = {
  "&.MuiFormControlLabel-root": {
    width: "100%",
    display: "block",
    margin: 0,
  },
  ".MuiButtonBase-root": {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
    opacity: 0,
    visibility: "hidden",
  },
  ".Mui-checked": {
    "~ .MuiTypography-root > .MuiBox-root": {
      border: "2px solid #59C9FA",
    },
  },
};

//Menu style
export const MenuStyle = {
  elevation: 0,
  sx: {
    overflow: "visible",
    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
    mt: 1.5,
    minWidth: 127,

    "&:before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: "background.paper",
      transform: "translateY(-50%) rotate(45deg)",
      zIndex: 0,
    },
  },
};

//Image remove close icon
export const imageCloseIconStyle = {
  position: "absolute",
  right: "2px",
  top: "2px",
  background: "white",
};
