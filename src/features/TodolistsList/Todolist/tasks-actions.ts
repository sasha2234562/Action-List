import { createAsyncThunk } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { todolistsAPI, UpdateTaskModelType } from "api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { AppRootStateType } from "app/store";
import { UpdateDomainTaskModelType } from "features/TodolistsList/tasks-reduser";

export const fetchTasksTC = createAsyncThunk("tasks/fetchTasks", async (todolistId: string, thunkAPI) => {
  thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
  const res = await todolistsAPI.getTasks(todolistId);
  const tasks = res.data.items;
  thunkAPI.dispatch(appActions.setAppStatus({ status: "succeeded" }));
  return { tasks, todolistId };
});
export const removeTaskTC = createAsyncThunk("tasks/removeTask", async (arg: {
  taskId: string,
  todolistId: string
}) => {
  const res = await todolistsAPI.deleteTask(arg.todolistId, arg.taskId);
  return { taskId: arg.taskId, todolistId: arg.todolistId };
});

export const addTaskTC = createAsyncThunk("task/addTask", async (arg: {
  title: string,
  todolistId: string
}, thunkAPI) => {
  thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await todolistsAPI.createTask(arg.todolistId, arg.title);
    if (res.data.resultCode === 0) {
      const task = res.data.data.item;
      thunkAPI.dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { task };
    } else {
      handleServerAppError(res.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue("error");
    }
  } catch (e) {
    handleServerNetworkError(e, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue("error");
  }
});

export const updateTaskTC = createAsyncThunk("task/updateTaskTC", async (arg: {
  taskId: string,
  domainModel: UpdateDomainTaskModelType,
  todolistId: string
}, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as AppRootStateType;
    const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
    if (!task) {
      return thunkAPI.rejectWithValue("task not found in the state");
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...arg.domainModel
    };

    const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel);
    if (res.data.resultCode === 0) {
      return { taskId: arg.taskId, model: arg.domainModel, todolistId: arg.todolistId };
    } else {
      handleServerAppError(res.data, thunkAPI.dispatch);
    }

  } catch (error) {
    handleServerNetworkError(error, thunkAPI.dispatch);
  }
  ;
});
