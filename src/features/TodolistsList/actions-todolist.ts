import * as tasksActions from './Todolist/tasks-actions'
import * as todolistsAsyncActions from './Todolist/actions-todolist'
import { sliceTodolists } from "features/TodolistsList/todolists-reducer";


const  todolistActions = {
  ...todolistsAsyncActions,
  ...sliceTodolists.actions
}
export {
  tasksActions,
  todolistActions
}