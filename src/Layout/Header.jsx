// import * as React from "react";
// ("react");
// import { drawerWidth, windowBreak } from "../Theme/customizeTheme";
// import MuiAppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import {
//   Avatar,
//   Box,
//   IconButton,
//   ListItemIcon,
//   Menu,
//   MenuItem,
//   Stack,
//   Tooltip,
//   Typography,
// } from "@mui/material";
// import { styled, useTheme } from "@mui/material/styles";
// import barIcon from "/assets/icons/bar_icon.svg";
// import alertIcon from "/assets/icons/alert-circle.svg";
// import notificationIcon from "/assets/icons/notification-03.svg";
// import userImage from "/assets/images/user_img.png";
// import HeaderTitle from "../Components/Title/HeaderTitle";
// import useWindowDimensions from "../Hooks/Theme/useWindowDimensions";
// import { useLocation } from "react-router-dom";
// import { useEffect } from "react";
// import { useState } from "react";
// import { useLayoutEffect } from "react";
// import { AiOutlineUser } from "react-icons/ai";
// import { BiLogOut } from "react-icons/bi";
// import { userMenuStyle } from "../Style/CustomStyle";
// import { useAuth } from "../Context/Auth/UseAuth";

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme, open }) => ({
//   transition: theme.transitions.create(["margin", "width"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open &&
//     window.innerWidth > windowBreak && {
//       width: `calc(100% - ${drawerWidth}px)`,
//       marginLeft: `${drawerWidth}px`,
//       transition: theme.transitions.create(["margin", "width"], {
//         easing: theme.transitions.easing.easeOut,
//         duration: theme.transitions.duration.enteringScreen,
//       }),
//     }),
// }));

// function Header({ open, handleDrawerToggle }) {
//   const [headerTitle, setHeaderTitle] = useState("Neemsah");
//   const [anchorEl, setAnchorEl] = React.useState(null);

//   //Context
//   const { signOut } = useAuth();
 

//   //?User menu dropdown

//   const openMenu = Boolean(anchorEl);
//   //Show Menu Dropdown
//   const handleShowMenu = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   //Hide Menu Dropdown
//   const handleHideMenu = () => {
//     setAnchorEl(null);
//   };

//   //Sing out
//   const handleLogOut = () => {
//     handleHideMenu();
//     signOut();
//   };

//   //Change Header Title
//   const location = useLocation();

//   useLayoutEffect(() => {
//     if (location?.pathname === "/") {
//       setHeaderTitle(location?.state || "Neemsah");
//     } else {
//       setHeaderTitle(location?.state || "Neemsah");
//     }
//   }, [location]);

//   return (
//     <div>
//       <AppBar
//         position="fixed"
//         open={open}
//         sx={{
//           flexDirection: "row",
//           alignItems: "center",
//           justifyContent: "space-between",
//           backgroundColor: "white",
//           boxShadow: "none",
//           borderBottom: "1px solid #EAEFF5",
//           padding: { xs: "0 21px", sm: "0 28px" },
//           minHeight: 72,
//         }}
//       >
//         <Toolbar
//           sx={{ gap: { xs: "8px 5px", sm: "0 21px" }, padding: "0 !important" }}
//         >
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             onClick={handleDrawerToggle}
//             edge="start"
//           >
//             <Box component={"img"} src={barIcon} alt="Bar icon" />
//           </IconButton>

//           <HeaderTitle text={headerTitle} />
//         </Toolbar>
//         <Stack
//           direction={"row"}
//           gap={"10px 21px"}
//           flexWrap={"wrap"}
//           alignItems={"center"}
//         >
//           {/* <Box sx={{ display: { xs: "none", sm: "block" } }}>
//             <IconButton>
//               <Box component={"img"} src={alertIcon} alt="alert icon" />
//             </IconButton>
//           </Box> */}
//           {/* <Box>
//           <Tooltip title="Log out">
//             <IconButton onClick={handleLogOut}>
//               <BiLogOut size={24} />
//             </IconButton>
//           </Tooltip>
//           </Box> */}
//           {/* <Box>
//             <IconButton>
//               <Box component={"img"} src={notificationIcon} alt="alert icon" />
//             </IconButton>
//           </Box> */}
//           <Box sx={{ ml: -1.5, display: { xs: "none", sm: "block" } }}>
//             <IconButton onClick={handleShowMenu}>
//               <Avatar
//                 src={userImage}
//                 alt="user image"
//                 sx={{ width: 40, height: 40 }}
//               />
//             </IconButton>
//           </Box>
//         </Stack>
//       </AppBar>

//       {/* User Dropdown Menu  */}
//       <Menu
//         anchorEl={anchorEl}
//         id="account-menu"
//         open={openMenu}
//         onClose={handleHideMenu}
//         onClick={handleHideMenu}
//         PaperProps={userMenuStyle}
//         transformOrigin={{ horizontal: "right", vertical: "top" }}
//         anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//       >
//         <MenuItem onClick={handleHideMenu}>
//           <ListItemIcon>
//             <AiOutlineUser size={22} />
//           </ListItemIcon>
//           My Profile
//         </MenuItem>
//         <MenuItem onClick={handleLogOut}>
//           <ListItemIcon>
//             <BiLogOut size={22} />
//           </ListItemIcon>
//           Logout
//         </MenuItem>
//       </Menu>
//     </div>
//   );
// }

// export default Header;
///////////////////


import * as React from "react";
import { drawerWidth, windowBreak } from "../Theme/customizeTheme";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import {
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import barIcon from "/assets/icons/bar_icon.svg";
import alertIcon from "/assets/icons/alert-circle.svg";
import notificationIcon from "/assets/icons/notification-03.svg";
import userImage from "/assets/images/user_img.png";
import HeaderTitle from "../Components/Title/HeaderTitle";
import useWindowDimensions from "../Hooks/Theme/useWindowDimensions";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { useLayoutEffect } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { userMenuStyle } from "../Style/CustomStyle";
import { useAuth } from "../Context/Auth/UseAuth";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open &&
    window.innerWidth > windowBreak && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}));

function Header({ open, handleDrawerToggle }) {
  const [headerTitle, setHeaderTitle] = useState("Neemsah");
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Context
  const { signOut, user } = useAuth(); // Destructure user from useAuth

  // User menu dropdown
  const openMenu = Boolean(anchorEl);

  // Show Menu Dropdown
  const handleShowMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Hide Menu Dropdown
  const handleHideMenu = () => {
    setAnchorEl(null);
  };

  // Sing out
  const handleLogOut = () => {
    handleHideMenu();
    signOut();
  };

  // Change Header Title
  const location = useLocation();

  useLayoutEffect(() => {
    if (location?.pathname === "/") {
      setHeaderTitle(location?.state || "Neemsah");
    } else {
      setHeaderTitle(location?.state || "Neemsah");
    }
  }, [location]);

  return (
    <div>
      <AppBar
        position="fixed"
        open={open}
        sx={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "white",
          boxShadow: "none",
          borderBottom: "1px solid #EAEFF5",
          padding: { xs: "0 21px", sm: "0 28px" },
          minHeight: 72,
        }}
      >
        <Toolbar
          sx={{ gap: { xs: "8px 5px", sm: "0 21px" }, padding: "0 !important" }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
          >
            <Box component={"img"} src={barIcon} alt="Bar icon" />
          </IconButton>

          <HeaderTitle text={headerTitle} />
        </Toolbar>
        <Stack
          direction={"row"}
          gap={"10px 21px"}
          flexWrap={"wrap"}
          alignItems={"center"}
        >
          <Box sx={{ ml: -1.5, display: { xs: "none", sm: "block" } }}>
            <IconButton onClick={handleShowMenu}>
              <Avatar
                src={userImage}
                alt="user image"
                sx={{ width: 40, height: 40 }}
              />
            </IconButton>
          </Box>
        </Stack>
      </AppBar>

      {/* User Dropdown Menu  */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={openMenu}
        onClose={handleHideMenu}
        onClick={handleHideMenu}
        PaperProps={userMenuStyle}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Typography variant="body1" sx={{ fontSize: "14px" }}>{user.email}</Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="body2">Role: {user.role}</Typography>
        </MenuItem>
        <MenuItem onClick={handleHideMenu}>
          <ListItemIcon>
            <AiOutlineUser size={22} />
          </ListItemIcon>
          My Profile
        </MenuItem>
        <MenuItem onClick={handleLogOut}>
          <ListItemIcon>
            <BiLogOut size={22} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}

export default Header;
