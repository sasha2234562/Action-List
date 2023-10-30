import * as tasksActions from './tasks-actions'
import * as todolistsAsyncActions from './actions-todolist'
import {sliceTodolists} from './todolists-reducer'


const  todolistActions = {
  ...todolistsAsyncActions,
  ...sliceTodolists.actions
}
export {
  tasksActions,
  todolistActions
}