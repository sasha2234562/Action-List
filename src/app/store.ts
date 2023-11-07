import { ActionCreatorsMapObject, AnyAction, bindActionCreators, combineReducers } from "redux";
import thunk from "redux-thunk";
import { appReducer } from "./app-reducer";
import { authReducer } from "features/Auth/auth-reducer";
import { configureStore } from "@reduxjs/toolkit";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useMemo } from "react";
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

export function useActions<T extends ActionCreatorsMapObject<any>>(actions: T) {
  const dispatch = useAppDispatch();
  return useMemo(() => {
    return bindActionCreators(actions, dispatch);
  }, []);
}

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
