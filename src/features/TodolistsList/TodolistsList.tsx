import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { AppRootStateType, useActions } from "app/store";
import { TodolistDomainType } from "features/TodolistsList/todolists-reducer";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { TasksStateType } from "features/TodolistsList/tasks-reducer";
import { todolistActions } from "features/TodolistsList/actions-todolist";

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {

  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>((state) => state.todolists);
  const tasks = useSelector<AppRootStateType, TasksStateType>((state) => state.tasks);
  const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.auth.isLoggedIn);
  const { fetchTodolistsTC,  addTodolistTC } = useActions(todolistActions);

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    fetchTodolistsTC();
  }, []);

  const addTodolist = useCallback(
    (title: string) => {
      addTodolistTC(title);
    },
    []
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
