import React, { useState } from "react";
import LoginLayout from "../../Components/Login/LoginLayout";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAuth } from "../../Context/Auth/UseAuth";
import AxiosInstance from "../../lib/axios/AxiosInstance";

//Validation
const validationSchema = Yup.object().shape({
  email: Yup.string().email("Enter valid email").required("Email must be fill"),
  password: Yup.string()
    .required("Password must be fill")
    .min(8, "Password must be at least 8 characters")
    .max(40, "Password must not exceed 40 characters"),
});

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  //Context
  const nagivate = useNavigate();
  const auth = useAuth();
  

  //react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  //Password visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //Submit login
  const handleSubmitLogin = async (data) => {
    //console.log("handleSubmitLogin - data:", data);
    auth.signIn(data.email, data.password);
    // nagivate("/");
  //   try {
  //     const res = await AxiosInstance.post(
  //       "/auth/login",
  //       {
  //         email: data.email,
  //         password: data.password,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           'Access-Control-Allow-Origin': '*',
  //         },
  //       }
  //     );
  //     console.log("handleSubmitLogin - res:", res);
  //     nagivate("/");
  //     if (res?.data?.success) {
  //       toast.success("Login Successfully");
  //       setUser(res?.data?.data?.user);
  //       setToken(res?.data?.data?.accessToken);
  //       setLocalStorage("user", res?.data?.data?.user);
  //       setLocalStorage("accessToken", res?.data?.data?.accessToken);
  //       setLocalStorage("refreshToken", res?.data?.data?.refreshToken);
  //       navigate("/");
  //     } else {
  //       toast.error("Please enter correct email and password");
  //     }
  //   } catch (error) {
  //     console.log("handleSubmitLogin - error:", error);
  //   }
    };

  return (
    <LoginLayout>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component={"form"}
          sx={{ maxWidth: 500, mx: "auto" }}
          onSubmit={handleSubmit(handleSubmitLogin)}
        >
          <Paper
            elevation={3}
            sx={{ p: { sm: 3, xs: 2 }, textAlign: "center" }}
          >
            <Avatar
              src="/assets/images/header/logo.png"
              alt="logo"
              variant="square"
              sx={{
                width: "auto",
                height: "auto",
                maxWidth: 300,
                maxHeight: 120,
                mx: "auto",
              }}
            />
            <Typography sx={{ mt: 2 }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure,
              sapiente laudantium obcaecati aperiam nisi aspernatur odio ut
            </Typography>
            <Box sx={{ mt: 3, textAlign: "start" }}>
              <Controller
                render={({ field, formState }) => (
                  <FormControl fullWidth variant="outlined">
                    <Typography
                      variant="formLabel"
                      color={!!formState.errors?.email ? red[700] : ""}
                    >
                      Email
                    </Typography>
                    <TextField
                      {...field}
                      error={!!formState.errors?.email}
                      placeholder="Enter Email"
                    />
                    {!!formState.errors?.email ? (
                      <FormHelperText error>
                        {errors?.email?.message}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                )}
                name="email"
                control={control}
                defaultValue=""
              />
              <Controller
                render={({ field, formState }) => (
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <Typography
                      variant="formLabel"
                      color={!!formState.errors?.password ? red[700] : ""}
                    >
                      Password
                    </Typography>
                    <TextField
                      {...field}
                      error={!!formState.errors?.password}
                      placeholder="Enter Password"
                      type={showPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <AiOutlineEyeInvisible />
                              ) : (
                                <AiOutlineEye />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {!!formState.errors?.password ? (
                      <FormHelperText error>
                        {errors?.password?.message}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                )}
                name="password"
                control={control}
                defaultValue=""
              />
              <Button sx={{ mt: 2 }} LinkComponent={Link} to="/forget-password">
                Forget Password
              </Button>
              <Button
                variant="contained"
                sx={{ mt: 3 }}
                type="submit"
                fullWidth
              >
                Login
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </LoginLayout>
  );
}

export default LoginPage;
