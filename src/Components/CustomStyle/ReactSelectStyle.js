import styled from "@emotion/styled";
import ReactSelect from "react-select";
import checkIcon from "/assets/icons/check_icon.png";
import plusShapeIcon from "/assets/icons/plus-shape-icon.png";
import { mobileBreak } from "../../Theme/customizeTheme";

//Regional Time Format Style
const ReactSelectStyle = styled(ReactSelect)(({ theme }) => ({
  ".select__control": {
    minHeight: "44px",
    borderRadius: "8px",
  },
  ".select__menu": {
    background: "#FFFFFF",
    border: "1px solid #E4E6EA",
    boxShadow: " 0px 20px 30px rgba(13, 12, 17, 0.15)",
    borderRadius: " 8px",
    width: window.innerWidth > mobileBreak ? "197px" : "160px",
    right: window.innerWidth > mobileBreak ? 0 : "auto",
  },
  ".select__option": {
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "20px",
    color: "#364050",
  },
  ".select__single-value": {
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "20px",
    color: " #80899A",
  },
  ".select__indicator-separator": {
    width: 0,
  },
  ".select__indicator-separator path": {
    fill: "#80899A",
    strokeWidth: 0.1,
  },
  ".select__option--is-selected": {
    position: "relative",
    background: "transparent",
    "&::after": {
      content: '""',
      position: "absolute",
      top: "8px",
      right: "15px",
      backgroundImage: `url(${checkIcon})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      width: "12px",
      height: "12px",
    },
  },
}));

//Regional Currency  Style
export const ReactSelectFullWidthStyle = styled(ReactSelect)(({ theme }) => ({
  ".select__control": {
    minHeight: "44px",
    borderRadius: "8px",
  },
  ".select__menu": {
    background: "#FFFFFF",
    border: "1px solid #E4E6EA",
    boxShadow: " 0px 20px 30px rgba(13, 12, 17, 0.15)",
    borderRadius: " 8px",
  },
  ".select__single-value": {
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "20px",
    color: " #80899A",
  },
  ".select__option": {
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "20px",
    color: "#364050",
  },
  ".select__indicator-separator": {
    width: 0,
  },
  ".select__indicator-separator path": {
    fill: "#80899A",
    strokeWidth: 0.1,
  },
  ".select__option--is-selected": {
    position: "relative",
    background: "transparent",
    "&::after": {
      content: '""',
      position: "absolute",
      top: "8px",
      right: "15px",
      backgroundImage: `url(${checkIcon})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      width: "12px",
      height: "12px",
    },
  },
}));

//select style with plus shape
export const ReactSelectFullWidthStyleShape = styled(ReactSelect)(
  ({ theme }) => ({
    ".select__control": {
      minHeight: "44px",
      borderRadius: "8px",
    },
    ".select__menu": {
      background: "#FFFFFF",
      border: "1px solid #E4E6EA",
      boxShadow: "0px 20px 30px rgba(13, 12, 17, 0.15)",
      borderRadius: " 8px",
      minWidth: 136,
      right: 0,
    },
    ".select__single-value": {
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "20px",
      color: " #80899A",
    },
    ".select__option": {
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "20px",
      color: "#364050",
    },
    ".select__indicator-separator": {
      width: 0,
    },
    ".select__indicator-separator path": {
      fill: "#80899A",
      strokeWidth: 0.1,
    },
    ".select__option--is-selected": {
      position: "relative",
      background: "transparent",
      "&::after": {
        content: '""',
        position: "absolute",
        top: "8px",
        right: "45px",
        backgroundImage: `url(${checkIcon})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        width: "12px",
        height: "12px",
      },
    },
    ".select__option": {
      position: "relative",
      background: "transparent",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "20px",
      color: " #364050",
      "&::before": {
        content: '""',
        position: "absolute",
        top: "8px",
        right: "15px",
        backgroundImage: `url(${plusShapeIcon})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        width: "18px",
        height: "18px",
      },
    },
  })
);

export default ReactSelectStyle;
