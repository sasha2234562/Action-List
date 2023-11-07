import { authAPI, LoginParamsType } from "api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { clearTasksAndTodolists } from "common/actions/common-actions";
import { createAppAsyncThunk } from "common/utils/create-app-async-thunk";
// thunks
export const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>("login", async (arg, {
  dispatch,
  rejectWithValue
}) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await authAPI.login(arg);
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { isLoggedIn: true };
    } else {
      handleServerAppError(res.data, dispatch, false);
      return rejectWithValue(res.data);
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});

const logout = createAsyncThunk<{ isLoggedIn: boolean }, undefined>("auth/logout", async (_, {
  dispatch,
  rejectWithValue
}) => {
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await authAPI.logout();
    if (res.data.resultCode === 0) {
      dispatch(clearTasksAndTodolists({ todolist: [], tasks: {} }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { isLoggedIn: false };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

export const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>("app/initializeAppTC",
  async (_, thunkAPI) => {
    try {
      const res = await authAPI.me();
      if (res.data.resultCode === 0) {
        return { isLoggedIn: true };
      } else {
        // handleServerAppError(res.data, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(null);
    } finally {
      thunkAPI.dispatch(appActions.initializeApp());
    }
  });

export const asyncActionsLog = { login, logout, initializeApp };

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });
    builder.addCase(initializeApp.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });

  }
});


export const authReducer = slice.reducer;
