import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { Route, Routes, useNavigate } from "react-router-dom"
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
} from "@mui/material"
import { Menu } from "@mui/icons-material"
import { Login } from "features/auth/ui/login/login"
import "./App.css"
import { TodolistsList } from "features/TodolistsList/TodolistsList"
import { ErrorSnackbar } from "common/components"
import { useActions } from "common/hooks"
import { authThunks, selectIsLoggedIn } from "features/auth/model"
import { selectAppStatus, selectIsInitialized } from "app"

function App() {
  const status = useSelector(selectAppStatus)
  const isInitialized = useSelector(selectIsInitialized)
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const { initializeApp, logout } = useActions(authThunks)
  console.log(isInitialized)
  useEffect(() => {
    if (!isInitialized) {
      initializeApp()
    }
  }, [])

  const logoutHandler = () => logout()

  if (!isInitialized) {
    return (
      <div className={"progress"}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className="App">
      <ErrorSnackbar />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">News</Typography>
          {isLoggedIn && (
            <Button color="inherit" onClick={logoutHandler}>
              Log out
            </Button>
          )}
        </Toolbar>
        {status === "loading" && <LinearProgress />}
      </AppBar>
      <Container fixed>
        <Routes>
          <Route path={"action-List"} element={<TodolistsList />} />
          <Route path={"login"} element={<Login />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App
