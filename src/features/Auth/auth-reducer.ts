import { authAPI, LoginParamsType } from "api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { clearTasksAndTodolists } from "common/actions/common-actions";
import { FieldErrorType } from "features/TodolistsList/tasks-reduser";
import { AxiosError } from "axios";

// thunks
const login = createAsyncThunk<void, LoginParamsType>("login", async (arg, { dispatch, rejectWithValue }) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await authAPI.login(arg);
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return;
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldErrors });
    }
  } catch (error) {
    // @ts-ignore
    // const error: AxiosError = err;
    handleServerNetworkError(error, dispatch);
    return rejectWithValue({ errors: error, fieldsErrors: undefined });
  }
});

const logout = createAsyncThunk<void, void>("auth/logout", async (_arg, {dispatch, rejectWithValue}) => {
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await authAPI.logout();
    if (res.data.resultCode === 0) {
      dispatch(clearTasksAndTodolists({ todolist: [], tasks: {} }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return;
    } else {
      handleServerAppError(res.data, dispatch);
      rejectWithValue({});
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue({});
  }
});

export const asyncActionsLog = { login, logout };

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
  extraReducers: builder => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoggedIn = true;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isLoggedIn = false;
    });

  }
});


export const authReducer = slice.reducer;
export const { setIsLoggedIn } = slice.actions;
