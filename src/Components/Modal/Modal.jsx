import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import closeIcon from "/assets/icons/modal_close_icon.png";
import { Box } from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  ".MuiPaper-root": {
    color:"black",
    background: "#FFFFFF",
    border: "1px solid #EAEFF5",
    boxShadow: "0px 40px 50px rgba(13, 12, 17, 0.05)",
    borderRadius: "12px",
    maxWidth: 600,
    width: "100%",
  },

  "& .MuiDialogContent-root": {
    padding: { xs: 1.8, sm: 2.5 },
    borderColor: "#eaeff5",
  },
  "& .MuiDialogActions-root": {
    padding: { xs: 1.8, sm: 2.5 },
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      component={"div"}
      sx={{ m: 0, p: { xs: 1.8, sm: 2.5 } }}
      {...other}
    >
      {children}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 12,
          top: 15,
        }}
      >
        <Box
          component={"img"}
          src={closeIcon}
          alt="close icon"
          sx={{ maxWidth: 24 }}
        />
      </IconButton>
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
};

function Modal({ isShowModal, handleCloseModal, title, children,width }) {
  return (
    <BootstrapDialog
    className="test asdglh"
      onClose={handleCloseModal}
      aria-labelledby="customized-dialog-title"
      open={isShowModal}
      sx={{
        ".MuiPaper-root": {
          maxWidth: width,
        },
      }}
    >
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={handleCloseModal}
      >
        <Typography variant="modalTitle">{title} </Typography>
      </BootstrapDialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </BootstrapDialog>
  );
}

Modal.defaultProps = {
  title: "Add Modal Title",
  modalFooter: "Add Modal footer",
};

export default Modal;
