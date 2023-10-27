import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "api/todolists-api";
import { AppRootStateType, AppThunk } from "app/store";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { appActions } from "app/app-reducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { actionsTodolists, fetchTodolistsTC, removeTodolistTC } from "features/TodolistsList/todolists-reducer";
import { clearTasksAndTodolists } from "common/actions/common-actions";

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


//slice
const sliceTasks = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {

    },
    updateTask: (state, action: PayloadAction<{
      taskId: string,
      model: UpdateDomainTaskModelType,
      todolistId: string
    }>) => {
      const tasksForTodolist = state[action.payload.todolistId];
      const index = tasksForTodolist.findIndex(t => t.id === action.payload.taskId);
      if (index !== -1) tasksForTodolist[index] = { ...tasksForTodolist[index], ...action.payload.model };
    }
  },
  extraReducers: builder => {
    builder.addCase(actionsTodolists.addTodolist, (state, action) => {
      state[action.payload.todolist.id] = [];
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
  }
});
export const tasksReducer = sliceTasks.reducer;
export const { updateTask } = sliceTasks.actions;

// thunks

export const updateTaskTC =
  (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
    (dispatch, getState: () => AppRootStateType) => {
      const state = getState();
      const task = state.tasks[todolistId].find((t) => t.id === taskId);
      if (!task) {
        //throw new Error("task not found in the state");
        console.warn("task not found in the state");
        return;
      }

      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...domainModel
      };

      todolistsAPI
        .updateTask(todolistId, taskId, apiModel)
        .then((res) => {
          if (res.data.resultCode === 0) {
            dispatch(updateTask({ taskId, model: domainModel, todolistId }));
          } else {
            handleServerAppError(res.data, dispatch);
          }
        })
        .catch((error) => {
          handleServerNetworkError(error, dispatch);
        });
    };

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
