import React, { useCallback, useEffect } from "react";
import { Delete } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { Task } from "./Task/Task";
import { tasksThunks, todolistsActions, todolistsThunks } from "features/TodolistsList";
import { TaskType } from "features/TodolistsList/todolists.api";
import { TaskStatuses } from "common/enums";
import { useActions } from "common/hooks";
import { AddItemForm, EditableSpan } from "common/components";
import { FilterValuesType, TodolistDomainType } from "features/TodolistsList";

type PropsType = {
  todolist: TodolistDomainType;
  tasks: TaskType[];
};
type ColorType = "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning"
export const Todolist = React.memo(function(props: PropsType) {
  const { fetchTasks, addTask } = useActions(tasksThunks);
  const { changeTodolistTitle, removeTodolist } = useActions(todolistsThunks);
  const { changeTodolistFilter } = useActions(todolistsActions);

  useEffect(() => {
    fetchTasks(props.todolist.id);
  }, []);

  const createTask = useCallback(
   async (title: string) => {
     await addTask({ title,todolistId: props.todolist.id }).unwrap().catch((e)=> {
       const error = e.messages[0]
       debugger
       throw new Error(error)
     })
    },
    [props.todolist.id]
  );

  const removeTodolistHandler = useCallback(() => {
    removeTodolist(props.todolist.id);
  }, [props.todolist.id]);

  const changeTodolistTitleHandler = useCallback(
    (title: string) => {
      changeTodolistTitle({ id: props.todolist.id, title }).unwrap().catch(e=> {
      });
    },
    [props.todolist.id]
  );
  let tasksForTodolist = props.tasks;

  if (props.todolist.filter === "active") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (props.todolist.filter === "completed") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.Completed);
  }
  const onFilterButtonClickHandler = useCallback((filter: FilterValuesType) =>
      changeTodolistFilter({ filter, id: props.todolist.id })
    , [props.todolist.id]);
  const renderButtonFilter = (buttonFilter: FilterValuesType, color: ColorType, title: string) => {
    return <Button
      variant={props.todolist.filter === buttonFilter ? "outlined" : "text"}
      onClick={() => onFilterButtonClickHandler(buttonFilter)}
      color={color}>
      {title}
    </Button>;
  };
  return (
    <div>
      <h3>
        <EditableSpan value={props.todolist.title} onChange={changeTodolistTitleHandler} />
        <IconButton onClick={removeTodolistHandler} disabled={props.todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={createTask} disabled={props.todolist.entityStatus === "loading"} />
      <div>
        {props.tasks.length ? null : <div>No Tasks</div>}
        {tasksForTodolist.map((t) => (
          <Task
            key={t.id}
            task={t}
            todolistId={props.todolist.id}
          />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        {renderButtonFilter("all", "inherit", "All")}
        {renderButtonFilter("active", "primary", "Active")}
        {renderButtonFilter("completed", "secondary", "Completed")}
      </div>
    </div>
  );
});
