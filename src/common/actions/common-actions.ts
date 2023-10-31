import { createAction } from "@reduxjs/toolkit";
import { TasksStateType } from "features/TodolistsList/task/tasks-reducer";
import { TodolistDomainType } from "features/TodolistsList/todo/todolists-reducer";

export type clearTasksAndTodolistsType = {
  tasks: TasksStateType
  todolist: TodolistDomainType[]
}

export const clearTasksAndTodolists = createAction<clearTasksAndTodolistsType>("common/clear-tasks-todolist");