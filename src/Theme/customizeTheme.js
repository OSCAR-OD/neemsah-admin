import { orange } from "@mui/material/colors";
import { createTheme, useTheme } from "@mui/material/styles";

//For Breakpoints
const theme = createTheme();

const customizeTheme = createTheme(theme, {
  status: {
    danger: orange[500],
  },
  palette: {
    primary: {
      main: "#057AFF",
    },
    secondary: {
      main: "#4FB5E5",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    formLabel: {
      fontWeight: 500,
      fontSize: " 14px",
      lineHeight: "20px",
      color: "#0D0C11",
      marginBottom: "8px",
    },
    formLabelSmall: {
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "20px",
      letterSpacing: "-0.01em",
      color: " #80899A",
      marginBottom: "8px",
    },
    welcomeTitle: {
      fontWeight: 600,
      fontSize: "24px",
      color: "#0D0C11",
      marginBottom: "15px",
      [theme.breakpoints.down("sm")]: {
        fontSize: "20px",
      },
    },
    formTitle: {
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "24px",
      color: "#0D0C11",
      marginBottom: "15px",
    },
    modalTitle: {
      fontWeight: 600,
      fontSize: "20px",
      lineHeight: "28px",
      color: "#0D0C11",
      [theme.breakpoints.down("sm")]: {
        fontSize: "16px",
      },
    },
    modalInnerTitle: {
      fontWeight: 600,
      fontSize: "18px",
      lineHeight: "24px",
      color: "#0D0C11",
      [theme.breakpoints.down("sm")]: {
        fontSize: "16px",
      },
    },
    modalInnerPara: {
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "24px",
      color: "#31384A",
    },
  },

  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          formLabel: "h4",
          formLabelSmall: "h6",
          welcomeTitle: "h2",
          formTitle: "h3",
          modalTitle: "h3",
          modalInnerTitle: "h3",
          modalInnerPara: "p",
        },
      },
    },

    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#6b6b6b #2b2b2b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#091c23",
            width: "5px",
            height: "5px",
            borderRadius: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#4FB5E5",
            minHeight: 24,
            border: "1px solid #2b2b2b",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
            {
              backgroundColor: "#26c3e7",
            },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
            {
              backgroundColor: "#26c3e7",
            },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: "#26c3e7",
            },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#26c3e7",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          ".MuiInputBase-root:not(.MuiInputBase-multiline,.MuiAutocomplete-inputRoot)":
            {
              height: "44px",
            },
          ".MuiInputBase-root": {
            borderRadius: "8px",
            fontWeight: 400,
            fontSize: "14px",
            color: "#0D0C11",
          },
          ".MuiAutocomplete-inputRoot": { padding: "5px 9px" },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "&.MuiInputBase-root": {
            height: "44px",
            borderRadius: "8px",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          "&.MuiInputBase-root": {
            height: "44px",
            borderRadius: "8px",
          },
          "&:not(.Mui-checked).MuiButtonBase-root": {
            color: "#A6ACB8",
          },
        },
      },
    },
    MuiStack: {
      styleOverrides: {
        root: {
          "&.MuiStack-root": {
            alignItems: "center",
            flexDirection: "row",
            flexWrap: "wrap",
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          ".MuiTypography-root": {
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "20px",
            color: "#31384A",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "9px 16px",
        },
      },
    },
    // MuiIconButton: {
    //   styleOverrides: {
    //     root: {
    //       border: "1px solid gray"
    //     },
    //   },
    // },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "white",
          color: "#31384A",
          border: "1px solid #dadde9",
          ".MuiTooltip-arrow": {
            color: "#f1f1f1",
          },
        },
      },
    },
  },
});
// customizeTheme.typography.modalTitle = {
//   fontSize: '1.2rem',
//   '@media (min-width:600px)': {
//     fontSize: '2.5rem',
//   },
//   [customizeTheme.breakpoints.up('md')]: {
//     fontSize: '2.4rem',
//   },
// };
export const drawerWidth = 256;
export const windowBreak = 960;
export const mobileBreak = 600;

export default customizeTheme;
