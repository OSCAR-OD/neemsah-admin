import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import customizeTheme from "./Theme/customizeTheme.js";

//Remove all
// if (import.meta.env.NODE_ENV !== "development") {
//   console.log = () => {};
//   //   console.warn = () => {};
//   //   console.info = () => {};
// }

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={customizeTheme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
