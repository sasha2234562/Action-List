import { createAsyncThunk } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { todolistsAPI } from "api/todolists-api";
import { handleServerNetworkError } from "utils/error-utils";
import { actionsTodolists } from "features/TodolistsList/todolists-reducer";
import { fetchTasksTC } from "features/TodolistsList/Todolist/tasks-actions";

export const fetchTodolistsTC = createAsyncThunk("todolists/fetchTodolists", async (arg, thunkAPI) => {
  try {
    thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.getTodolists();
    thunkAPI.dispatch(appActions.setAppStatus({ status: "succeeded" }));
    res.data.forEach(t => {
      thunkAPI.dispatch(fetchTasksTC(t.id));
    });
    return { todolists: res.data };
  } catch (e) {
    handleServerNetworkError(e, thunkAPI.dispatch);
  }
});
export const removeTodolistTC = createAsyncThunk("todolists/removeTodolist", async (todolistId: string, thunkAPI) => {
  try {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    thunkAPI.dispatch(actionsTodolists.changeTodolistEntityStatus({ id: todolistId, entityStatus: "loading" }));
    const res = await todolistsAPI.deleteTodolist(todolistId);
    //скажем глобально приложению, что асинхронная операция завершена
    thunkAPI.dispatch(appActions.setAppStatus({ status: "succeeded" }));
    if (res.data.resultCode === 0) return { todolistId };
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

export const addTodolistTC = createAsyncThunk("todolist/addTodolist", async (title: string, {
  dispatch,
  rejectWithValue
}) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await todolistsAPI.createTodolist(title);
    dispatch(appActions.setAppStatus({ status: "succeeded" }));
    return { todolist: res.data.data.item };
  } catch (e) {
    return rejectWithValue(e)
  }

});

export const changeTodolistTitleTC = createAsyncThunk("todolist/changeTodolistTitle", async (arg: {
  id: string,
  title: string
}, { rejectWithValue }) => {
  try {
    const res = await todolistsAPI.updateTodolist(arg.id, arg.title)
    return { id:arg.id, title: arg.title }
  } catch (e) {
    return rejectWithValue(e)
  }
});
