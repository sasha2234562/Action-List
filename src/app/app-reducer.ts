import { authAPI } from "api/todolists-api";
import { authActions } from "features/Login/auth-reducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";


//thunk
export const initializeAppTC = createAsyncThunk("app/initializeAppTC", async (arg, {dispatch}) => {
  try {
    const res = await authAPI.me();
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
    }
    return
  } catch (e) {
    return
  }
});

//slice
export const appSlice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false
  },
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: null | string }>) => {
      state.error = action.payload.error;
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status;
    }
  },
  extraReducers: builder => {
    builder.addCase(initializeAppTC.fulfilled, (state) => {
      state.isInitialized = true
    });
  }
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;


//type
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
