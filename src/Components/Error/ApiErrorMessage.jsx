import { Alert, AlertTitle, Stack } from "@mui/material";
import React from "react";

function ApiErrorMessage({ handleError, errorType, errorStatus }) {
  if (errorType === "multiple") {
    return (
      <>
        {handleError !== null &&
          handleError.map((item, index) => {
            return (
              <Stack sx={{ width: "100%", mt: 2 }} spacing={2} key={index}>
                <Alert severity={errorStatus} sx={{ fontSize: "16px" }}>
                  <AlertTitle sx={{ textTransform: "capitalize" }}>
                    {errorStatus}{" "}
                  </AlertTitle>
                  {item}
                </Alert>
              </Stack>
            );
          })}
      </>
    );
  } else if (errorType === "single") {
    return (
      <>
        {handleError !== null && (
          <Stack sx={{ width: "100%", mt: 2 }} spacing={2}>
            <Alert severity={errorStatus} sx={{ fontSize: "16px" }}>
              <AlertTitle sx={{ textTransform: "capitalize" }}>
                {errorStatus}{" "}
              </AlertTitle>
              {handleError}
            </Alert>
          </Stack>
        )}
      </>
    );
  }
}

ApiErrorMessage.defaultProps = {
  handleError: null,
  errorType: "multiple",
  errorStatus: "warning",
};

export default ApiErrorMessage;
