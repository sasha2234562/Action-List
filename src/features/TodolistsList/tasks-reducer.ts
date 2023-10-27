import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "api/todolists-api";
import { AppRootStateType, AppThunk } from "app/store";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { appActions } from "app/app-reducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { actionsTodolists } from "features/TodolistsList/todolists-reducer";
import { clearTasksAndTodolists } from "common/actions/common-actions";

export const fetchTasksTC = createAsyncThunk("tasks/fetchTasks", async (todolistId: string, thunkAPI) => {
  thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
  const res = await todolistsAPI.getTasks(todolistId);
  const tasks = res.data.items;
  thunkAPI.dispatch(appActions.setAppStatus({ status: "succeeded" }));
  return { tasks, todolistId };
});
export const removeTaskTC = createAsyncThunk("tasks/removeTask", async (param: {
  taskId: string,
  todolistId: string
}) => {
  const res = await todolistsAPI.deleteTask(param.todolistId, param.taskId);
  return { taskId: param.taskId, todolistId: param.todolistId };
});

const sliceTasks = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      const tasksForTodolist = state[action.payload.task.todoListId];
      tasksForTodolist.unshift(action.payload.task);
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
    })
      .addCase(actionsTodolists.removeTodolist, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(actionsTodolists.setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl: { id: string }) => {
          state[tl.id] = [];
        });
      })
      .addCase(clearTasksAndTodolists, (state, action) => {
        return action.payload.tasks;
      })
      .addCase(fetchTasksTC.fulfilled, (state, action) => {
        return { ...state, [action.payload.todolistId]: action.payload.tasks };
      })
      .addCase(removeTaskTC.fulfilled, (state, action)=> {
        const tasksForTodolist = state[action.payload.todolistId];
        const index = tasksForTodolist.findIndex((task) => task.id === action.payload.taskId);
        if (index !== -1) tasksForTodolist.splice(index, 1);
      })
  }
});
export const tasksReducer = sliceTasks.reducer;
export const { addTask, updateTask } = sliceTasks.actions;

// thunks

export const addTaskTC =
  (title: string, todolistId: string): AppThunk =>
    (dispatch) => {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      todolistsAPI
        .createTask(todolistId, title)
        .then((res) => {
          if (res.data.resultCode === 0) {
            const task = res.data.data.item;
            dispatch(addTask({ task }));
            dispatch(appActions.setAppStatus({ status: "succeeded" }));
          } else {
            handleServerAppError(res.data, dispatch);
          }
        })
        .catch((error) => {
          handleServerNetworkError(error, dispatch);
        });
    };
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
