import React from "react";
import { ProvideAuth } from "../Context/Auth/UseAuth";
import NoInternetConnection from "../Layout/NoInternetConnection";

function ProviderWrapper({ children }) {
  return (
    <ProvideAuth>
      {children}
      {/*<NoInternetConnection />*/}
    </ProvideAuth>
  );
}

export default ProviderWrapper;
