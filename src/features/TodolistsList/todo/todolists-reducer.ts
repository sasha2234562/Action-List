import { todolistsAPI, TodolistType } from "api/todolists-api";
import { appActions, RequestStatusType } from "app/app-reducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions/common-actions";
import { handleServerNetworkError } from "utils/error-utils";
import { tasksActions, todolistActions } from "features/TodolistsList/index";
import { fetchTasksTC } from "features/TodolistsList/task/tasks-reducer";


export const fetchTodolistsTC = createAsyncThunk("todolists/fetchTodolists", async (arg, thunkAPI) => {
  try {
    thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.getTodolists();

    thunkAPI.dispatch(appActions.setAppStatus({ status: "succeeded" }));
    res.data.forEach(t => {
      // thunkAPI.dispatch(fetchTasksTC(t.id));
    });
    return { todolists: res.data };
  } catch (e) {
    handleServerNetworkError(e, thunkAPI.dispatch);
  }
});
export const removeTodolistTC = createAsyncThunk("todolists/removeTodolist", async (todolistId: string, thunkAPI) => {
  try {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    thunkAPI.dispatch(sliceTodolists.actions.changeTodolistEntityStatus({ id: todolistId, entityStatus: "loading" }));
    const res = await todolistsAPI.deleteTodolist(todolistId);
    //скажем глобально приложению, что асинхронная операция завершена
    thunkAPI.dispatch(appActions.setAppStatus({ status: "succeeded" }));
    if (res.data.resultCode === 0) return { todolistId };
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

export const addTodolistTC = createAsyncThunk("todolist/addTodolist", async (title: string, {
  dispatch,
  rejectWithValue
}) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await todolistsAPI.createTodolist(title);
    dispatch(appActions.setAppStatus({ status: "succeeded" }));
    return { todolist: res.data.data.item };
  } catch (e) {
    return rejectWithValue(e);
  }

});

export const changeTodolistTitleTC = createAsyncThunk("todolist/changeTodolistTitle", async (arg: {
  id: string,
  title: string
}, { rejectWithValue }) => {
  try {
    const res = await todolistsAPI.updateTodolist(arg.id, arg.title);
    return { id: arg.id, title: arg.title };
  } catch (e) {
    return rejectWithValue(e);
  }
});

// export const asyncActionsTodo = {
//   fetchTodolistsTC,
//   removeTodolistTC,
//   addTodolistTC,
//   changeTodolistTitleTC
// };

//slice
export const sliceTodolists = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
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
    });
    builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
      const index = state.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) state[index].title = action.payload.title;
    });
  }
});

export const todolistsReducer = sliceTodolists.reducer;
// types

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
