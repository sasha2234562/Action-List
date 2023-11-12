import { initialState } from "app/app.reducer";
import { store } from "app/store";


//app-reduserTypes
export type AppInitialStateType = typeof initialState;
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

// store-types

export type AppRootStateType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;