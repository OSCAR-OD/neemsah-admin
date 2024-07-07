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
  password: Yup.string().required("Password must be fill"),
  passwordConfirm: Yup.string().required("Password must be fill"),
});

function ChangePasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  //Password visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //Password Confirm visibility
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  //login
  const handleSubmitLogin = (data) => {
    nagivate("/login");
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
              <Controller
                render={({ field, formState }) => (
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <Typography
                      variant="formLabel"
                      color={
                        !!formState.errors?.passwordConfirm ? red[700] : ""
                      }
                    >
                      Confirm Password
                    </Typography>
                    <TextField
                      {...field}
                      error={!!formState.errors?.password}
                      placeholder="Enter Re-Type Password"
                      type={showConfirmPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowConfirmPassword}
                              onMouseDown={handleMouseDownConfirmPassword}
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <AiOutlineEyeInvisible />
                              ) : (
                                <AiOutlineEye />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {!!formState.errors?.passwordConfirm ? (
                      <FormHelperText error>
                        {errors?.passwordConfirm?.message}
                      </FormHelperText>
                    ) : (
                      ""
                    )}
                  </FormControl>
                )}
                name="passwordConfirm"
                control={control}
                defaultValue=""
              />

              <Button
                variant="contained"
                sx={{ mt: 3 }}
                type="submit"
                fullWidth
              >
                Change Password
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </LoginLayout>
  );
}

export default ChangePasswordPage;
