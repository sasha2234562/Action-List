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
// @ts-ignore
window.store = store;
