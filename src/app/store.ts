import { configureStore } from "@reduxjs/toolkit";
import { tasksReducer } from "features/TodolistsList";
import { todolistsReducer } from "features/TodolistsList";
import { appReducer } from "app/app.reducer";
import {authSlice} from "features/auth/model";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authSlice,
  },
});

export type AppRootStateType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// @ts-ignore
window.store = store;
