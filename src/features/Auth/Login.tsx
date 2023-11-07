import React from "react";
import { FormikHelpers, useFormik } from "formik";
import { useSelector } from "react-redux";
import { sectorAuth } from "./index";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "hooks/useAppDispatch";
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField } from "@mui/material";
import { LoginParamsType } from "api/todolists-api";
import { BaseResponseType } from "common/types";
import { login } from "features/Auth/auth-reducer";

type FormValuesType = {
  email: string
  password: string
  rememberMe: boolean
}

export const Login = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector(sectorAuth);


  const formik = useFormik({
    validate: (values) => {
      // if (!values.email) {
      //   return {
      //     email: "Email is required"
      //   };
      // }
      // if (!values.password) {
      //   return {
      //     password: "Password is required"
      //   };
      // }
    },
    initialValues: {
      email: "",
      password: "",
      rememberMe: false
    },
    // validate: (values) => {
    //   const errors: FormikErrorType = {};
    //   if (!values.email) {
    //     errors.email = "Email is required";
    //   } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    //     errors.email = "Invalid email address";
    //   }
    //
    //   if (!values.password) {
    //     errors.password = "Required";
    //   } else if (values.password.length < 3) {
    //     errors.password = "Must be 3 characters or more";
    //   }
    //
    //   return errors;
    // },
    // initialValues: {
    //   email: "",
    //   password: "",
    //   rememberMe: false
    // },
    onSubmit: async (values: FormValuesType, formikHelpers: FormikHelpers<LoginParamsType>) => {
      dispatch(login(values)).unwrap()
        .then(res => {

        }).catch((e: BaseResponseType) => {
        e.fieldsErrors?.forEach(i => {
          formikHelpers.setFieldError(i.field, i.error);
        });
      });
    }

  });


  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }
  return (
    <Grid container justifyContent="center">
      <Grid item xs={4}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered{" "}
                <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p> Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField label="Email" margin="normal" {...formik.getFieldProps("email")} />
              {formik.errors.email ? <div style={{ color: "red" }}>{formik.errors.email}</div> : null}
              <TextField
                type="password"
                label="Password"
                margin="normal"
                {...formik.getFieldProps("password")}
              />
              {formik.errors.password ? <div style={{ color: "red" }}>{formik.errors.password}</div> : null}
              <FormControlLabel
                label={"Remember me"}
                control={
                  <Checkbox
                    {...formik.getFieldProps("rememberMe")}
                    checked={formik.values.rememberMe}
                  />
                }
              />
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};
