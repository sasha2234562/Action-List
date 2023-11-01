import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { AppRootStateType, useActions } from "app/store";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { selectors, todolistActions } from "features/TodolistsList/index";
import { sectorAuth } from "features/Auth";

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {

  const todolists = useSelector(selectors.selectTodolists);
  const tasks = useSelector(selectors.selectTasks);
  const isLoggedIn = useSelector<AppRootStateType, boolean>(sectorAuth);
  const { fetchTodolistsTC, addTodolistTC } = useActions(todolistActions);

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
          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  tasks={tasks[tl.id]}
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
