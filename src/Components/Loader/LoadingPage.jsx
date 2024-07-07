import { Stack } from "@mui/material";
import infiniteLoading from "/assets/images/infinite-loading.gif";

function LoadingPage() {
  return (
    <Stack
      sx={{
        width: "100vw",
        height: "100vh",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <img src={infiniteLoading} alt="loading gif" />
    </Stack>
  );
}

export default LoadingPage;
