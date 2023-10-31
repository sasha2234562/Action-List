import {  sliceTodolists } from "features/TodolistsList/todo/todolists-reducer";
// import {asyncActionsTodo} from  './todo/index'
import {asyncActionsTask} from './task/index'

const todolistActions = {
  // ...asyncActionsTodo,
  ...sliceTodolists.actions
};

const tasksActions = {
 ...asyncActionsTask
};

export {
  tasksActions,
  todolistActions
};