import { todolistsAPI, TodolistType } from "api/todolists-api";
import { Dispatch } from "redux";
import {
  appActions,
  RequestStatusType
} from "app/app-reducer";
import { handleServerNetworkError } from "utils/error-utils";
import { AppThunk } from "app/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTasksTC } from "features/TodolistsList/tasks-reducer";
import { clearTasksAndTodolists } from "common/actions/common-actions";

//thunks
export const fetchTodolistsTC = createAsyncThunk("todolists/fetchTodolists", async (arg, thunkAPI) => {
  try {
    thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.getTodolists();
    thunkAPI.dispatch(appActions.setAppStatus({ status: "succeeded" }));
    res.data.forEach(t => {
      thunkAPI.dispatch(fetchTasksTC(t.id));
    });
    return { todolists: res.data };
  } catch (error) {
    handleServerNetworkError(error, thunkAPI.dispatch);
  }
});
export const removeTodolistTC = createAsyncThunk("todolists/removeTodolist", async (todolistId: string, thunkAPI) => {
  try {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    thunkAPI.dispatch(actionsTodolists.changeTodolistEntityStatus({ id: todolistId, entityStatus: "loading" }));
    const res = await todolistsAPI.deleteTodolist(todolistId);
    //скажем глобально приложению, что асинхронная операция завершена
    thunkAPI.dispatch(appActions.setAppStatus({ status: "succeeded" }));
    if (res.data.resultCode === 0) return { todolistId };
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const addTodolistTC = createAsyncThunk('todolist/addTodolist',async (title: string, {dispatch})=> {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  const res = await todolistsAPI.createTodolist(title)
    dispatch(appActions.setAppStatus({ status: "succeeded" }));
  return { todolist: res.data.data.item }
})

//slice
const sliceTodolists = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistTitle: (state, action: PayloadAction<{ id: string, title: string }>) => {
      const index = state.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) state[index].title = action.payload.title;
    },
    changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
      const index = state.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) => {
      const index = state.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) state[index].entityStatus = action.payload.entityStatus;
    }
  },
  extraReducers: builder => {
    builder.addCase(clearTasksAndTodolists, (state, action) => {
      return action.payload.todolist;
    });
    builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
      if (action.payload) {
        return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
      }
    });
    builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
      const index = state.findIndex(todo => action.payload?.todolistId === todo.id);
      if (index !== -1) state.splice(index, 1);
    });
    builder.addCase(addTodolistTC.fulfilled, (state, action) => {
      const newTodolist: TodolistDomainType = { ...action.payload.todolist, filter: "all", entityStatus: "idle" };
      state.unshift(newTodolist);
    })
  }
});

export const todolistsReducer = sliceTodolists.reducer;
export const actionsTodolists = sliceTodolists.actions;
// thunks
export const changeTodolistTitleTC = (id: string, title: string) => {
  return (dispatch: Dispatch) => {
    todolistsAPI.updateTodolist(id, title).then((res) => {
      dispatch(actionsTodolists.changeTodolistTitle({ id, title }));
    });
  };
};

// types

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
