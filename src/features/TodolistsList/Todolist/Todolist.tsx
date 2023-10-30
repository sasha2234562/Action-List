import React, { useCallback } from "react";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import { Task } from "./Task/Task";
import { TaskStatuses, TaskType } from "api/todolists-api";
import { TodolistDomainType } from "../todolists-reducer";
import { Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useActions } from "app/store";
import { tasksActions, todolistActions } from "features/TodolistsList/todolist-index";

type PropsType = {
  todolist: TodolistDomainType
  tasks: Array<TaskType>
  demo?: boolean
}

export const Todolist = React.memo(function({ demo = false, ...props }: PropsType) {

  const { addTaskTC, removeTaskTC,updateTaskTC} = useActions(tasksActions);
  const {  removeTodolistTC, changeTodolistTitleTC ,changeTodolistFilter} = useActions(todolistActions)


  const addTask = useCallback(
    (title: string) => {
      addTaskTC({ title, todolistId: props.todolist.id });
    },
    [props.todolist.id]
  );
  const removeTodolist = () => {
    removeTodolistTC(props.todolist.id);
  };
  const changeTodolistTitle = useCallback(
    (title: string) => {
      changeTodolistTitleTC({id:props.todolist.id, title});
    },
    [props.todolist.id]
  );
  const onAllClickHandler = useCallback(
    () => changeTodolistFilter({ filter:"all",id: props.todolist.id }),
    [props.todolist.id]
  );
  const onActiveClickHandler = useCallback(
    () => changeTodolistFilter({ filter:"active",id: props.todolist.id }),
    [props.todolist.id]
  );
  const onCompletedClickHandler = useCallback(
    () =>changeTodolistFilter({ filter:"completed", id:props.todolist.id }),
    [props.todolist.id]
  );

  let tasksForTodolist = props.tasks;

  if (props.todolist.filter === "active") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (props.todolist.filter === "completed") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  return (
    <div>
      <h3>
        <EditableSpan value={props.todolist.title} onChange={changeTodolistTitle} />
        <IconButton onClick={removeTodolist} disabled={props.todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === "loading"} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task
            key={t.id}
            task={t}
            todolistId={props.todolist.id}
            removeTask={removeTaskTC}
            changeTaskTitle={updateTaskTC}
            changeTaskStatus={updateTaskTC}
          />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        <Button
          variant={props.todolist.filter === "all" ? "outlined" : "text"}
          onClick={onAllClickHandler}
          color={"inherit"}
        >
          All
        </Button>
        <Button
          variant={props.todolist.filter === "active" ? "outlined" : "text"}
          onClick={onActiveClickHandler}
          color={"primary"}
        >
          Active
        </Button>
        <Button
          variant={props.todolist.filter === "completed" ? "outlined" : "text"}
          onClick={onCompletedClickHandler}
          color={"secondary"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});
