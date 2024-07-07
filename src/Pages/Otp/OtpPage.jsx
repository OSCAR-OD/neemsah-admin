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

//Validation Form
const validationSchema = Yup.object().shape({
  otp: Yup.string().required("Otp must be fill"),
  
});

function OtpPage() {
 

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
  const handleSubmitLogin = (data) => {
    nagivate("/change-password");
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
                      color={!!formState.errors?.otp ? red[700] : ""}
                    >
                      Otp
                    </Typography>
                    <TextField
                      {...field}
                      error={!!formState.errors?.otp}
                      placeholder="Enter Otp"
                    />
                    {!!formState.errors?.otp ? (
                      <FormHelperText error>
                        {errors?.otp?.message}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                )}
                name="otp"
                control={control}
                defaultValue=""
              />
          
           
              <Button
                variant="contained"
                sx={{ mt: 3 }}
                type="submit"
                fullWidth
              >
                Reset
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </LoginLayout>
  );
}

export default OtpPage;
