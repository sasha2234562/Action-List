import { authAPI, LoginParamsType } from "api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";
import { appActions } from "app/app-reducer";
import { clearTasksAndTodolists } from "common/actions/common-actions";

export const loginTC = createAsyncThunk("login", async (data: LoginParamsType, thunkAPI) => {
  thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await authAPI.login(data);
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { isLoggedIn: true };
    } else {
      handleServerAppError(res.data, thunkAPI.dispatch);
    }
  } catch (error) {
    handleServerNetworkError(error, thunkAPI.dispatch);
  }
});

export const loginTC_ =
  (data: LoginParamsType): AppThunk =>
    (dispatch) => {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      authAPI
        .login(data)
        .then((res) => {
          if (res.data.resultCode === 0) {
            dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
            dispatch(appActions.setAppStatus({ status: "succeeded" }));
          } else {
            handleServerAppError(res.data, dispatch);
          }
        })
        .catch((error) => {
          handleServerNetworkError(error, dispatch);
        });
    };

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    }
  },
  extraReducers: bilder => {
    bilder.addCase(loginTC.fulfilled, (state, action) => {
      if (action.payload) {
        state.isLoggedIn = action.payload.isLoggedIn;
      }
    });
  }
});
// thunks
export const logOutTC =
  (): AppThunk => (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    authAPI
      .logout()
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(clearTasksAndTodolists({ todolist: [], tasks: {} }));
          dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }));
          dispatch(appActions.setAppStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };

export const authReducer = slice.reducer;
export const authActions = slice.actions;
