import { red } from "@mui/material/colors";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import {
  Box,
  Grid,
  InputAdornment,
  FormHelperText,
  FormControl,
  Typography,
  TextField,
} from "@mui/material";
import StarFormLabel from "../../Form/StarFormLabel";
import searchIcon from "/assets/icons/search_icon.png";
import ReactSelectStyle from "../../CustomStyle/ReactSelectStyle";
import watchIcon from "/assets/icons/watch_icon.png";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { GrValidate } from "react-icons/gr";
import DialogActions from "@mui/material/DialogActions";
import SubmitButton from "../../Form/SubmitButton";

//Validation Form
const validationSchema = Yup.object().shape({
  holidayName: Yup.string().required("Holiday Name is required"),
  date: Yup.string().required("Date is required"),
  regionSearch: Yup.string().required("Region is required"),
  startTime: Yup.string(),
  endTime: Yup.string(),
});

//Data
const timeOptions = [
  {
    id: 1,
    label: "08:00 AM",
    value: "8",
  },
  {
    id: 2,
    label: "08:15 AM",
    value: "244",
  },
  {
    id: 3,
    label: "08:30 AM",
    value: "88",
  },
  {
    id: 4,
    label: "08:45 AM",
    value: "2454",
  },
  {
    id: 5,
    label: "09:00 AM",
    value: "85",
  },
];

function RegionalSettingsModal({ handleAddSubmit, isEditModal, handleCancel }) {
  //Id generator
  let uuid = self.crypto.randomUUID();

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

  return (
    <Box component={"form"} onSubmit={handleSubmit()}>
      <Grid
        container
        rowSpacing={{ xs: "16px", sm: "24px" }}
        columnSpacing={{ xs: "12px", sm: "20px" }}
      >
        <Grid item xs={12}>
          <Controller
            render={({ field, formState }) => (
              <FormControl fullWidth variant="outlined">
                <Typography
                  variant="formLabel"
                  color={!!formState.errors?.holidayName ? red[700] : ""}
                >
                  Holiday Name <StarFormLabel />
                </Typography>
                <TextField
                  {...field}
                  error={!!formState.errors?.holidayName}
                  placeholder="Holiday name"
                />
                {!!formState.errors?.holidayName ? (
                  <FormHelperText error>
                    {errors?.holidayName?.message}
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            )}
            name="holidayName"
            control={control}
            defaultValue=""
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <Controller
            render={({ field, formState }) => (
              <FormControl fullWidth variant="outlined">
                <ReactSelectStyle
                  styles={{
                    control: (base) => ({
                      ...base,
                      // border: !!formState.errors?.endTime
                      //   ? "1px solid #D32F2F"
                      //   : "1px solid #C4C4C4",
                      // "&:hover": {
                      //   border: !!formState.errors?.endTime
                      //     ? "1px solid #D32F2F"
                      //     : "1px solid #C4C4C4",
                      // },
                      paddingLeft: 30,
                    }),
                  }}
                  className="basic-single"
                  classNamePrefix="select"
                  isClearable={true}
                  isSearchable={true}
                  name="startTime"
                  placeholder={"Start time"}
                  options={timeOptions}
                  value={
                    field?.value !== ""
                      ? timeOptions?.filter(
                          (option) => option?.value === field?.value
                        )[0]
                      : null
                  }
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption?.value);
                  }}
                />
                <Box
                  component={"img"}
                  src={watchIcon}
                  alt="watch icon"
                  sx={{
                    width: "16px",
                    position: "absolute",
                    top: "13px",
                    left: "15px",
                  }}
                />
                {/* {!!formState.errors?.endTime ? (
                          <FormHelperText error>
                            {errors?.endTime?.message}
                          </FormHelperText>
                        ) : (
                          ""
                        )} */}
              </FormControl>
            )}
            name="startTime"
            control={control}
            defaultValue=""
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <Controller
            render={({ field, formState }) => (
              <FormControl fullWidth variant="outlined">
                <ReactSelectStyle
                  styles={{
                    control: (base) => ({
                      ...base,
                      // border: !!formState.errors?.endTime
                      //   ? "1px solid #D32F2F"
                      //   : "1px solid #C4C4C4",
                      // "&:hover": {
                      //   border: !!formState.errors?.endTime
                      //     ? "1px solid #D32F2F"
                      //     : "1px solid #C4C4C4",
                      // },
                      paddingLeft: 30,
                    }),
                  }}
                  className="basic-single"
                  classNamePrefix="select"
                  isClearable={true}
                  isSearchable={true}
                  name="endTime"
                  placeholder={"End time"}
                  options={timeOptions}
                  value={
                    field?.value !== ""
                      ? timeOptions?.filter(
                          (option) => option?.value === field?.value
                        )[0]
                      : null
                  }
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption?.value);
                  }}
                />
                <Box
                  component={"img"}
                  src={watchIcon}
                  alt="watch icon"
                  sx={{
                    width: "16px",
                    position: "absolute",
                    top: "13px",
                    left: "15px",
                  }}
                />
                {/* {!!formState.errors?.endTime ? (
                          <FormHelperText error>
                            {errors?.endTime?.message}
                          </FormHelperText>
                        ) : (
                          ""
                        )} */}
              </FormControl>
            )}
            name="endTime"
            control={control}
            defaultValue=""
          />
        </Grid>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <Controller
              render={({ field, formState }) => (
                <FormControl
                  fullWidth
                  variant="outlined"
                  sx={{
                    ".MuiStack-root": {
                      pt: 0,
                    },
                  }}
                >
                
                  <Typography
                    variant="formLabel"
                    color={!!formState.errors?.date ? red[700] : ""}
                  >
                    Date <StarFormLabel />
                  </Typography>

                  <DemoContainer
                    components={["DatePicker"]}
                    sx={{
                      ".MuiTextField-root": {
                        width: "100%",
                        overflow: "hidden",
                      },
                    }}
                  >
                    <DatePicker
                      sx={{
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: `${
                            !!formState.errors?.date
                              ? "#d32f2f "
                              : "rgba(0, 0, 0, 0.23) "
                          } !important`,
                        },
                      }}
                      format="DD/MM/YYYY"
                      {...field}
                    />
                  </DemoContainer>

                  {!!formState.errors?.date ? (
                    <FormHelperText error>
                      {errors?.date?.message}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              )}
              name="date"
              control={control}
              defaultValue=""
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12}>
          <Controller
            render={({ field, formState }) => (
              <FormControl fullWidth variant="outlined">
                <Typography
                  variant="formLabel"
                  color={!!formState.errors?.regionSearch ? red[700] : ""}
                >
                  Region <StarFormLabel />
                </Typography>
                <TextField
                  {...field}
                  error={!!formState.errors?.regionSearch}
                  placeholder="Search by town/city, post code..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          component={"img"}
                          src={searchIcon}
                          alt="user icon"
                          sx={{ width: 15 }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
                {!!formState.errors?.regionSearch ? (
                  <FormHelperText error>
                    {errors?.regionSearch?.message}
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            )}
            name="regionSearch"
            control={control}
            defaultValue=""
          />
        </Grid>
      </Grid>
      <Box>
        <SubmitButton
          dividerMarginTop={{ xs: "20px", sm: "24px" }}
          dividerMarginBottom={{ xs: "20px", sm: "24px" }}
          horizontalAlignment={"start"}
          submitBtnText={"Next"}
          buttonMinWidth={108}
          onCancelClick={handleCancel}
          borderWidth={"calc(100% + 48px )"}
          borderMarginLeft={"-24px"}
        />
      </Box>
    </Box>
  );
}

export default RegionalSettingsModal;
