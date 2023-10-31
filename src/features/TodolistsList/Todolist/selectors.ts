import { AppRootStateType } from "app/store";
import { TodolistDomainType } from "features/TodolistsList/todolists-reducer";
import { TasksStateType } from "features/TodolistsList/tasks-reduser";

export const selectTodolists = (state: AppRootStateType): Array<TodolistDomainType> => state.todolists;
export const selectTasks = (state: AppRootStateType):TasksStateType => state.tasks;