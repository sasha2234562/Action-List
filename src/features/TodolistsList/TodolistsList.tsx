import React, { useCallback, useEffect } from "react"
import { useSelector } from "react-redux"
import { todolistsThunks } from "features/TodolistsList"
import { Grid, Paper } from "@mui/material"
import { AddItemForm } from "common/components"
import { Todolist } from "./Todolist/Todolist"
import { Navigate } from "react-router-dom"
import { useActions } from "common/hooks"
import { selectIsLoggedIn } from "features/auth/model"
import { selectTasks } from "features/TodolistsList"
import { selectTodolists } from "features/TodolistsList"
import l from "features/TodolistsList/Todolists-List.module.css"

export const TodolistsList = () => {
  const todolists = useSelector(selectTodolists)
  const tasks = useSelector(selectTasks)
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const { fetchTodolists, addTodolist } = useActions(todolistsThunks)

  useEffect(() => {
    if (!isLoggedIn) {
      return
    }
    fetchTodolists()
  }, [])

  const createTodolist = useCallback(async (title: string) => {
    await addTodolist(title)
      .unwrap()
      .catch((e) => {
        const error = e.messages[0]
        throw new Error(error)
      })
  }, [])

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />
  }

  return (
    <>
      <Grid container className={l.itemForm}>
        <AddItemForm addItem={createTodolist} />
      </Grid>
      <Grid container spacing={3} className={l.todolistsContainer}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id]

          return (
            <Grid item key={tl.id}>
              <Paper className={l.paper}>
                <Todolist todolist={tl} tasks={allTodolistTasks} />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
