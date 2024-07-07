import { Avatar, Paper, TableCell, Typography } from "@mui/material";
import React from "react";
import noRecordImage from "/assets/images/no-record.png";

function DataNotFoundTable({ isShowShadow, column }) {
  return (
    <TableCell colSpan={column}>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          py: 3,
          px: { lg: 4, md: 3, xs: 2 },
          minHeight: { md: "60vh", sm: "50vh", xs: "50vh" },
        }}
        elevation={isShowShadow ? 1 : 0}
      >
        <Avatar
          src={noRecordImage}
          alt="No Record Image"
          variant="square"
          sx={{ width: 300, height: 300 }}
        />
        <Typography variant="modalTitle" color={"primary"}>
          No records has been added yet.
        </Typography>
      </Paper>
    </TableCell>
  );
}

DataNotFoundTable.defaultProps = {
  isShowShadow: false,
  column: 3,
};

export default DataNotFoundTable;
