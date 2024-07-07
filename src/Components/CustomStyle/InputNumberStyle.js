import PhoneInput from "react-phone-input-2";
import styled from "@emotion/styled";

export const NumberInputStyle = styled(PhoneInput)(() => ({
  ".form-control": {
    fontSize: "16px",
    color: "#212168",
    width: "100%",
    height: "44px",
    borderRadius: "8px",
    border: "1px solid #E4E6EA",
  },
  ".flag-dropdown ":{
    borderRadius: "8px 0 0 8px",
    border: "1px solid #E4E6EA",
    backgroundColor:"white",
  }
}));
