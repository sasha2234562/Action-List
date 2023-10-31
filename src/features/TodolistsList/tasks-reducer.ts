import { TaskPriorities, TaskStatuses, TaskType } from "api/todolists-api";
import { createSlice } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions/common-actions";
import { addTodolistTC, fetchTodolistsTC, removeTodolistTC } from "features/TodolistsList/Todolist/actions-todolist";
import { addTaskTC, fetchTasksTC, removeTaskTC, updateTaskTC } from "features/TodolistsList/Todolist/tasks-actions";

//slice
const sliceTasks = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(addTodolistTC.fulfilled, (state, action) => {
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
