import { Box, Grid } from "@mui/material";
 import bgImage from "/assets/images/login_bg.jpg";

function LoginLayout({ children }) {
  return (
    <Box>
      <Grid container columnSpacingSpacing={2} sx={{ height: "100vh" }}>
        <Grid
          item
          md={7}
          xs={12}
          sx={{
            backgroundImage: `url(${bgImage})`,
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            display: { md: "flex", xs: "none" },
          }}></Grid>
        
        <Grid item md={5} xs={12}>
          <Box sx={{ p: 2 }}>{children}</Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LoginLayout;
