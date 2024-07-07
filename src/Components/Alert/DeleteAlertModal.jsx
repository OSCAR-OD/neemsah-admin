import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Stack, Typography } from "@mui/material";
import { AiFillWarning } from "react-icons/ai";

function DeleteAlertModal({
  isOpen,
  handleAlertClose,
  handleAlertAction,
  title,
  isBodyCustomText,
  modifyText,
  customText,
  agreeButtonText,
  disAgreeButtonText,
}) {
  return (
    <Dialog
      open={isOpen}
      onClose={handleAlertClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Stack
          alignItems={"center"}
          justifyContent={"center"}
          direction="column"  // Correcting the direction prop here
          sx={{ pt: 3 }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              border: "1px solid #c59b47",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AiFillWarning size={35} color={"#eed202"} />
          </Box>
          <Typography sx={{ mt: 1 }} variant={"modalTitle"}>
            {title}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {isBodyCustomText ? (
            <Typography>{customText}</Typography>
          ) : (
            <Typography>
              Are you sure you want to delete this {modifyText}? Once deleted,
              you will not get this {modifyText} data back.
            </Typography>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleAlertClose}
          variant="contained"
          color="secondary"
        >
          {disAgreeButtonText}
        </Button>
        <Button onClick={handleAlertAction} autoFocus variant="contained">
          {agreeButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DeleteAlertModal.defaultProps = {
  title: "Are you sure you want to delete?",
  isBodyCustomText: false,
  modifyText: "module name",
  customText: "",
  agreeButtonText: "Agree",
  disAgreeButtonText: "Disagree",
};

export default DeleteAlertModal;