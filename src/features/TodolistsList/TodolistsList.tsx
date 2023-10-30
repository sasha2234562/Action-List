import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { AppRootStateType, useActions } from "app/store";
import {
  actionsTodolists,
  addTodolistTC,
  changeTodolistTitleTC,
  fetchTodolistsTC,
  FilterValuesType,
  removeTodolistTC,
  TodolistDomainType
} from "./todolists-reducer";
import { TaskStatuses } from "api/todolists-api";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "hooks/useAppDispatch";
import { TasksStateType } from "features/TodolistsList/tasks-reducer";
import { tasksActions } from "features/TodolistsList/todolist-index";

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(
    (state) => state.todolists
  );
  const tasks = useSelector<AppRootStateType, TasksStateType>((state) => state.tasks);
  const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.auth.isLoggedIn);

  const { updateTaskTC, removeTaskTC, addTaskTC} =useActions(tasksActions)
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    dispatch(fetchTodolistsTC());
  }, []);

  const removeTask = useCallback(function(taskId: string, todolistId: string) {
    removeTaskTC({taskId, todolistId})
  }, []);

  const addTask = useCallback(function(title: string, todolistId: string) {
    dispatch(addTaskTC({ title, todolistId }));
  }, []);

  const changeStatus = useCallback(function(id: string, status: TaskStatuses, todolistId: string) {
    updateTaskTC({taskId:id, domainModel:{ status }, todolistId});
  }, []);

  const changeTaskTitle = useCallback(function(id: string, newTitle: string, todolistId: string) {
    updateTaskTC({taskId:id, domainModel:{ title: newTitle }, todolistId});
  }, []);

  const changeFilter = useCallback(function(value: FilterValuesType, todolistId: string) {
    dispatch(actionsTodolists.changeTodolistFilter({ id: todolistId, filter: value }));
  }, []);

  const removeTodolist = useCallback(function(id: string) {
    dispatch(removeTodolistTC(id));
  }, []);

  const changeTodolistTitle = useCallback(function(id: string, title: string) {
    dispatch(changeTodolistTitleTC({ id, title }));
  }, []);

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(addTodolistTC(title));
    },
    [dispatch]
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                  demo={demo}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
