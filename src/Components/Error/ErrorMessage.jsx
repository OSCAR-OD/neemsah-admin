import { Alert, Box, Paper } from "@mui/material";
import erorrImage from "/assets/images/error_icon.png";

function ErrorMessage({ message }) {
  //console.log("ErrorMessage - message:", message);
  return (
    <Paper
      elevation={2}
      sx={{
        // display: "flex",
        // flexDirection: "column",
        // alignItems: "center",
        // justifyContent:"center",
        py: 3,
        px: { lg: 4, md: 3, xs: 2 },
        maxWidth: "800px",
        minHeight: { md: "60vh", sm: "50vh", xs: "50vh" },
        width: "100%",
        mx: "auto",
        textAlign: "center",
      }}
    >
      <Box sx={{ maxWidth: "150px", mx: "auto", mt: 4 }}>
        <img src={erorrImage} alt="error icon" style={{ width: "100%" }} />
      </Box>
      <Alert variant="filled" severity="error" sx={{ mt: 2, fontSize: 18 }}>
        {message ? message : "Something went wrong"}
      </Alert>
    </Paper>
  );
}

ErrorMessage.defaultProps = {
  message: "Something went wrong",
};

export default ErrorMessage;
