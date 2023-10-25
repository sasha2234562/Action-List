import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "api/todolists-api";
import { AppRootStateType, AppThunk } from "app/store";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { appActions } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { actionsTodolists } from "features/TodolistsList/todolists-reducer";

const sliceTasks = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    removeTask: (state, action: PayloadAction<{ taskId: string, todolistId: string }>) => {
      const tasksForTodolist = state[action.payload.todolistId];
      const index = tasksForTodolist.findIndex((task) => task.id === action.payload.taskId);
      if (index !== -1) tasksForTodolist.splice(index, 1);
    },
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
    },
    setTasks: (state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) => {
      return { ...state, [action.payload.todolistId]: action.payload.tasks };
    },
    clearTasks: (state)=> {
      return {}
    }
  },
  extraReducers: (builder) => {
    builder.addCase(actionsTodolists.addTodolist, (state, action) => {
      state[action.payload.todolist.id] = [];
    })
      .addCase(actionsTodolists.removeTodolist, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(actionsTodolists.setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      });
  }
});
export const tasksReducer = sliceTasks.reducer;
export const actionsTasks = sliceTasks.actions;

// thunks
export const fetchTasksTC =
  (todolistId: string): AppThunk => (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistsAPI.getTasks(todolistId).then((res) => {
      const tasks = res.data.items;
      dispatch(actionsTasks.setTasks({ tasks, todolistId }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    });
  };
export const removeTaskTC =
  (taskId: string, todolistId: string): AppThunk => (dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId).then(() => {
      dispatch(actionsTasks.removeTask({ taskId, todolistId }));
    });
  };
export const addTaskTC =
  (title: string, todolistId: string): AppThunk =>
    (dispatch) => {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      todolistsAPI
        .createTask(todolistId, title)
        .then((res) => {
          if (res.data.resultCode === 0) {
            const task = res.data.data.item;
            dispatch(actionsTasks.addTask({ task }));
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
            dispatch(actionsTasks.updateTask({ taskId, model: domainModel, todolistId }));
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
