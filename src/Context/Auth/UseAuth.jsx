// Hook (use-auth.js)
import React, { useState, useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosInstance from "../../lib/axios/AxiosInstance";
import {
  getLocalStorage,
  setLocalStorage,
} from "../../utils/LocalStorage/ManageLocalStorage";

const authContext = createContext();
// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  if (auth.loading) {
    // Return a loading indicator or null
    return null; // or return a loading spinner component
  }
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(false);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true); //Set loading to true initially
  const navigate = useNavigate();

  //Set value from localStorage
  useEffect(() => {
    const storageUser = getLocalStorage("user");
    const storageToken = getLocalStorage("accessToken");
    setUser(storageUser);
    setToken(storageToken);
    setLoading(false); // Set loading to false after data has been fetched
  }, []);

  const signIn = async (email, password) => {
    try {
      const res = await AxiosInstance.post("/auth/login", {
        email: email,
        password: password,
      });
     // console.log(res?.data?.data?.accessToken, "signIn - res:", res);
      if (res?.data?.success) {
        toast.success("Login Successfully");
        setUser(res?.data?.data?.user);
        setToken(res?.data?.data?.accessToken);
        setLocalStorage("user", res?.data?.data?.user);
        setLocalStorage("accessToken", res?.data?.data?.accessToken);
        setLocalStorage("refreshToken", res?.data?.data?.refreshToken);
        navigate("/");
      } else {
        toast.error("Please enter correct email and password");
      }
    } catch (error) {
     // console.log("signIn - error:", error);
      if (!error?.data?.success) {
        toast.error("Please enter correct email and password");
      } else {
        toast.error(error.response.data.message);
      }
    }
  };

  const signOut = async () => {
    try {
      let res;
      if (token) {
        res = await AxiosInstance.post(
          "/logout",
          {},
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        setUser(false);
        setToken(false);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        navigate("/login");
        toast.success("Logout Successfully");
      } else {
        if (localStorage.getItem("accessToken") !== null) {
          res = await AxiosInstance.post(
            "/logout",
            {},
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
              },
            }
          );
          setUser(false);
          setToken(false);
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
          navigate("/login");
          toast.success("Logout Successfully");
        } else {
          setUser(false);
          setToken(false);
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
          navigate("/login");
          toast.warn("Something went wrong");
        }
      }
    } catch (error) {
      setUser(false);
      setToken(false);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
      toast.error(error.response.data.message);
    }
  };


  return {
    user,
    token,
    loading,
    signIn,
    signOut,
  };
}
