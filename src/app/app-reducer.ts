import { createSlice, PayloadAction } from "@reduxjs/toolkit";


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
    },
    initializeApp: (state) => {
      state.isInitialized = true;
    }
  }
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;


//type
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
