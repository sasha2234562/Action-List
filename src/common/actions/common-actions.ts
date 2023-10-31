import { createAction } from "@reduxjs/toolkit";
import { TasksStateType } from "features/TodolistsList/tasks-reduser";
import { TodolistDomainType } from "features/TodolistsList/todolists-reducer";


export type clearTasksAndTodolistsType = {
  tasks: TasksStateType
  todolist: TodolistDomainType[]
}

export const clearTasksAndTodolists = createAction<clearTasksAndTodolistsType>("common/clear-tasks-todolist");