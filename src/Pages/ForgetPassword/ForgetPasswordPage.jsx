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
import AxiosInstance from "../../lib/axios/AxiosInstance";
import { toast } from "react-toastify";

//Validation Form
const validationSchema = Yup.object().shape({
  email: Yup.string().email("Enter valid email").required("Email must be fill"),
});

function ForgetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);

  const nagivate = useNavigate();

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

  //Submit login
  const handleSubmitLogin = async (data) => {
    //console.log("handleSubmitLogin - data:", data);

    try {
      const res = await AxiosInstance.post("/auth/reset/email", {
        email: data?.email,
      });
      //console.log(res?.data, "handleSubmitLogin - res:", res);
      if (res?.data?.success) {
        toast.success("Please check your email");
        nagivate("/otp");
      } else if (!res?.data?.success) {
        toast.warn(res?.data?.message);
      } else {
        toast.warn("Something went wrong about reset email");
      }
    } catch (error) {
      //console.log("handleSubmitLogin - error:", error);
      toast.warn("Something went wrong");
    }
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

              <Button sx={{ mt: 2 }} LinkComponent={Link} to="/login">
                Login
              </Button>
              <Button
                variant="contained"
                sx={{ mt: 3 }}
                type="submit"
                fullWidth
              >
                Send
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </LoginLayout>
  );
}

export default ForgetPasswordPage;
