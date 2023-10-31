import { authAPI, LoginParamsType } from "api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { clearTasksAndTodolists } from "common/actions/common-actions";
import { AxiosError } from "axios";

// thunks
const loginTC = createAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>("login", async (data, thunkAPI) => {
  thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await authAPI.login(data);
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { isLoggedIn: true };
    } else {
      handleServerAppError(res.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldErrors });
    }
  } catch (err) {
    // @ts-ignore
    const error: AxiosError = err;
    handleServerNetworkError(error, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue({ errors: error, fieldsErrors: undefined });
  }
});

const logoutTC = createAsyncThunk("auth/logout", async (arg, thunkAPI) => {
  try {
    thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await authAPI.logout();
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(clearTasksAndTodolists({ todolist: [], tasks: {} }));
      thunkAPI.dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return;
    } else {
      handleServerAppError(res.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({})
    }
  } catch (e) {
    handleServerNetworkError(e, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue({})
  }
});

export const asyncActionslog = {loginTC, logoutTC}

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
    builder.addCase(loginTC.fulfilled, (state, action) => {
      state.isLoggedIn = true;
    });
    builder.addCase(logoutTC.fulfilled, (state, action) => {
      state.isLoggedIn = false;
    });

  }
});


export const authReducer = slice.reducer;
export const { setIsLoggedIn } = slice.actions;
