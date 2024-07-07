import * as React from "react";
import { Box } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { styled, useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import useWindowDimensions from "../Hooks/Theme/useWindowDimensions";
import { drawerWidth, windowBreak } from "../Theme/customizeTheme";
import DrawerHeaderSpace from "../Components/Header/DrawerHeaderSpace";
import { useState } from "react";
import { useAuth } from "../Context/Auth/UseAuth";
import { getLocalStorage } from "../utils/LocalStorage/ManageLocalStorage";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: window.innerWidth > 960 ? `-${drawerWidth}px` : 0,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

function Layout() {
  const { width } = useWindowDimensions();
  const [open, setOpen] = useState(
    window.innerWidth > windowBreak ? true : false
  );

  //Context
  const { token } = useAuth();

  //Common Header codes
  const CommonHeaders = () => {
    return (
      <div>
        <CssBaseline />
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <Header open={open} handleDrawerToggle={handleDrawerToggle} />
          <Sidebar
            open={open}
            handleDrawerToggle={handleDrawerToggle}
            width={width}
          />
          <Main
            open={open}
            style={{
              width:
                open && width > windowBreak ? "calc(100vw - 304px )" : "100vw",
            }}
          >
            <DrawerHeaderSpace handleDrawerToggle={handleDrawerToggle} />

            <Outlet />
          </Main>
        </Box>
      </div>
    );
  };

  const handleDrawerToggle = () => {
    setOpen((prev) => !prev);
  };
//   //Auth code
//    const auth = useAuth();
//    if (auth.token) {
//        return <>{children}</>;
//    } else {
//        const token = localStorage.getItem("token");
//        if (token !== null) {
//            return <>{children}</>;
//        }
//    }
//    return <Navigate to="/home/banner  " />;
//  //return <Navigate to={redirectRoute} />;

//    if (token) {
//      return CommonHeaders();
//    }

  if (getLocalStorage("accessToken") !== null) {
    return CommonHeaders();
  }
  return <Navigate to="/login" replace />;
}

export default Layout;
