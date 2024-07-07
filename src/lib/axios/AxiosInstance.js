import axios from "axios";
import {
  getLocalStorage,
  setLocalStorage,
} from "../../utils/LocalStorage/ManageLocalStorage";

const AxiosInstance = axios.create({
  baseURL:"https://api.neemsah.com/api/v1",
  //baseURL:"http://localhost:5500/api/v1",
  //baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 60000,
});

// AxiosInstance.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     console.log("error:", error);
//     if (error.response.status === 403) {
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );
// const axiosInstance = axios.create({
//   baseURL: baseUrl // API base URL
// });

// Request interceptor
AxiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] =
        "Bearer " + getLocalStorage("accessToken");
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let refresh = true;
// Response interceptor
AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !refresh) {
      refresh = true;

      // Obtain new access token using refresh token
      const refreshToken = getLocalStorage("refreshToken");
      try {
        const newAccessToken = await AxiosInstance.post("/auth/refresh-token", {
          token: refreshToken,
        });
        // console.log(
        //   typeof newAccessToken?.data?.data?.token,
        //   "newAccessToken:",
        //   newAccessToken
        // );
        if (newAccessToken) {
          // localStorage.setItem(
          //   "accessToken",
          //   `${newAccessToken?.data?.data?.token}`
          // );
          setLocalStorage("accessToken", newAccessToken?.data?.data?.token);

          // Retry the original request with the new access token
          originalRequest.headers["Authorization"] =
            "Bearer " + newAccessToken?.data?.data?.token;
          return AxiosInstance(originalRequest);
        } else {
          // localStorage.clear();
        //  console.error("Error refreshing access token:", error);
          window.location.href = "/login";
        }
      } catch (error) {
        // Handle the error scenario
        // localStorage.clear();
       // console.error("Error refreshing access token:", error);
        window.location.href = "/login";
      }
    }
    refresh = false;
    return Promise.reject(error);
  }
);

export default AxiosInstance;
