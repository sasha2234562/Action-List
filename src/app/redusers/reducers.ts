// мы задаём структуру нашего единственного объекта-состояния
import { appReducer } from 'app'
import {combineReducers} from 'redux'
import { tasksReducer, todolistsReducer } from "features/TodolistsList";
import {authSlice} from "features/auth/model";
// объединяя reducer-ы с помощью combineReducers,
// непосредственно создаём store
//export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
export const rootReducer = combineReducers({
  app: appReducer,
  auth: authSlice,
  todolists: todolistsReducer,
  tasks: tasksReducer
})
