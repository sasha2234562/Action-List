import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "api/todolists-api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions/common-actions";
import { appActions } from "app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { AppRootStateType } from "app/store";
import { addTodolistTC, fetchTodolistsTC, removeTodolistTC } from "features/TodolistsList/todolists-reducer";
import { AxiosError } from "axios";

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

export const addTaskTC = createAsyncThunk
  //   <TaskType, { title: string, todolistId: string }
  //   { rejectedValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> } }
  // >
  ("task/addTask", async (arg: {
    title: string,
    todolistId: string
  }, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      const res = await todolistsAPI.createTask(arg.todolistId, arg.title);
      if (res.data.resultCode === 0) {
        const task = res.data.data.item;
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { task };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(res.data.messages);
      }
    } catch (error: any) {
      // const e: AxiosError = error;
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(error);
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

//slice
const sliceTasks = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(addTodolistTC.fulfilled, (state, action) => {
      if (action.payload) state[action.payload.todolist.id] = [];
    });
    builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
      if (action.payload) delete state[action.payload.todolistId];
    });
    builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
      if (action.payload) {
        action.payload.todolists.forEach((tl: { id: string }) => {
          state[tl.id] = [];
        });
      }
    });
    builder.addCase(clearTasksAndTodolists, (state, action) => {
      return action.payload.tasks;
    });
    builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
      return { ...state, [action.payload.todolistId]: action.payload.tasks };
    });
    builder.addCase(removeTaskTC.fulfilled, (state, action) => {
      const tasksForTodolist = state[action.payload.todolistId];
      const index = tasksForTodolist.findIndex((task) => task.id === action.payload.taskId);
      if (index !== -1) tasksForTodolist.splice(index, 1);
    });
    builder.addCase(addTaskTC.fulfilled, (state, action) => {
      const tasksForTodolist = state[action.payload.task.todoListId];
      tasksForTodolist.unshift(action.payload.task);
    });
    builder.addCase(updateTaskTC.fulfilled, (state, action) => {
      if (action.payload) {
        const tasksForTodolist = state[action.payload.todolistId];
        const index = tasksForTodolist.findIndex(t => t.id === action.payload?.taskId);
        if (index !== -1) tasksForTodolist[index] = { ...tasksForTodolist[index], ...action.payload.model };
      }
    });
  }
});

// reducer
export const tasksReducer = sliceTasks.reducer;

// types
export type TasksStateType = {
  [key: string]: Array<TaskType>
}
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type FieldErrorType = {
  error: string;
  field: string;
};