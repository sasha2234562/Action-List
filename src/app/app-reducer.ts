import { authAPI } from "api/todolists-api";
import { actionsLogin } from "features/Auth";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { handleServerNetworkError } from "utils/error-utils";


//thunk
const initializeApp = createAsyncThunk<void, void>("app/initializeAppTC", async (_arg, {
  dispatch,
  rejectWithValue
}) => {
  try {
    const res = await authAPI.me();
    if (res.data.resultCode === 0) {
      dispatch(actionsLogin.setIsLoggedIn({ isLoggedIn: true }));
      return;
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
  finally {
  asyncActionsinitializeApp.initializeApp()
  }
});

export const asyncActionsinitializeApp = { initializeApp };
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
    builder.addCase(initializeApp.fulfilled, (state) => {
      state.isInitialized = true;
    });
  }
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;


//type
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
