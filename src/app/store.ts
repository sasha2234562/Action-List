import { appReducer } from "./app-reducer";
import { authReducer } from "features/Auth/auth-reducer";
import { configureStore } from "@reduxjs/toolkit";
import { tasksReducer } from "features/TodolistsList/tasks-reduser";
import { todolistsReducer } from "features/TodolistsList/todolists-reducer";

// непосредственно создаём store
export const store = configureStore({ reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
  } });
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
