import { Alert, Box, Paper } from "@mui/material";

function ErrorMessage({ message }) {
  return (
    <Paper
      elevation={2}
      sx={{
        py: 3,
        px: { lg: 4, md: 3, xs: 2 },
        maxWidth: "700px",
        width: "100%",
        mx: "auto",
        textAlign: "center",
      }}
    >
      <Box sx={{ maxWidth: "150px", mx: "auto" }}>
        <img
          src="/assets/images/error_icon.png"
          alt="error icon"
          style={{ width: "100%" }}
        />
      </Box>
      <Alert variant="filled" severity="error" sx={{ mt: 2, fontSize: 18 }}>
        {message}
      </Alert>
    </Paper>
  );
}

ErrorMessage.defaultProps = {
  message: "Something went wrong",
};

export default ErrorMessage;
