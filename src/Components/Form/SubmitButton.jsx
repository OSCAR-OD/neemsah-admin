import { Box, Button, Divider, Stack } from "@mui/material";
import React from "react";

function SubmitButton({
  isShowTopDivider,
  horizontalAlignment,
  isShowCancelBtn,
  cancelBtnText,
  submitBtnText,
  onCancelClick,
  onSubmitClick,
  dividerMarginTop,
  dividerMarginBottom,
  buttonMinWidth,
  submitBtnType,
  borderWidth,
  borderMarginLeft,
}) {
  return (
    <Box>
      {isShowTopDivider ? (
        <Divider
          sx={{
            marginTop: dividerMarginTop,
            marginBottom: dividerMarginBottom,
            width: borderWidth,
            marginLeft: borderMarginLeft,
          }}
        />
      ) : null}

      <Stack direction={"row"} justifyContent={horizontalAlignment} gap={2}>
        {isShowCancelBtn ? (
          <Button
            variant="outlined"
            type={"button"}
            sx={{
              fontWeight: 600,
              fontSize: "15px",
              lineHeight: "24px",
              letterSpacing: " 0.02em",
              color: "#0B1234",
              background: " #FFFFFF",
              border: "1px solid #E6E6E7",
              boxShadow: "0px 1px 2px rgba(2, 4, 13, 0.05)",
              borderRadius: " 8px",
              textTransform: "none",
              minWidth: buttonMinWidth,
              minHeight: "40px",
            }}
            onClick={onCancelClick}
          >
            {cancelBtnText}
          </Button>
        ) : null}

        <Button
          variant="contained"
          type={submitBtnType}
          sx={{
            fontWeight: 600,
            fontSize: "15px",
            lineHeight: "24px",
            letterSpacing: " 0.02em",
            color: "#FFFFFF",
            background: " #4FB5E5",
            boxShadow: "0px 1px 2px rgba(2, 4, 13, 0.05)",
            borderRadius: " 8px",
            textTransform: "none",
            minWidth: buttonMinWidth,
            minHeight: "40px",
          }}
          onClick={onSubmitClick}
        >
          {submitBtnText}
        </Button>
      </Stack>
    </Box>
  );
}

SubmitButton.defaultProps = {
  isShowTopDivider: true,
  isShowCancelBtn: true,
  horizontalAlignment: "end",
  submitBtnText: "Save",
  cancelBtnText: "Cancel",
  dividerMarginTop: { xs: "40px", sm: "50px" },
  dividerMarginBottom: { xs: "20px", sm: "32px" },
  buttonMinWidth: { sm: 136, xs: 110 },
  submitBtnType: "submit",
  borderWidth: "100%",
  borderMarginLeft: "0",
};

export default SubmitButton;
