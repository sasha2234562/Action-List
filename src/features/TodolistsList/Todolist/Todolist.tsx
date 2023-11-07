import React, { useCallback } from "react";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import { Task } from "./Task/Task";
import { TaskStatuses, TaskType } from "api/todolists-api";
import { Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { tasksActions, todolistActions } from "features/TodolistsList/index";
import { FilterValuesType, TodolistDomainType } from "features/TodolistsList/todolists-reducer";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useActions } from "hooks/useActions";


type PropsType = {
  todolist: TodolistDomainType
  tasks: Array<TaskType>
  demo?: boolean
}
type RerenderFilterButtonColorType = "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning"
export const Todolist = React.memo(function({ demo = false, ...props }: PropsType) {

  const { addTaskTC } = useActions(tasksActions);
  const { removeTodolistTC, changeTodolistTitleTC, changeTodolistFilter } = useActions(todolistActions);
  const dispatch = useAppDispatch();

  const addTask = useCallback(async (title: string) => {
    // const thunk =
      addTaskTC({ title, todolistId: props.todolist.id });
    // const resultAction = await dispatch(thunk);
    // if (addTaskTC.rejected.match(resultAction)) {
    //   if (resultAction.payload?.fieldsErrors.length) {
    //
    //   }
    // }
    // if (addTaskTC.rejected.match(action)) {
    //   if (action.payload) {
    //
    //   }
    // }
  }, [props.todolist.id]);
  const removeTodolist = () => {
    removeTodolistTC(props.todolist.id);
  };
  const changeTodolistTitle = useCallback(
    (title: string) => {
      changeTodolistTitleTC({ id: props.todolist.id, title });
    },
    [props.todolist.id]
  );
  const onFilterButtonClickHandler = useCallback(
    (filter: FilterValuesType) => changeTodolistFilter({ filter, id: props.todolist.id }),
    [props.todolist.id]
  );
  const rerenderFilterButton = (color: RerenderFilterButtonColorType,
                                title: string, buttonFilter: FilterValuesType) => {

    return <Button
      variant={props.todolist.filter === buttonFilter ? "outlined" : "text"}
      onClick={() => onFilterButtonClickHandler(buttonFilter)}
      color={color}
    >
      {title}
    </Button>;
  };

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
          />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        {rerenderFilterButton("inherit", "All", "all")}
        {rerenderFilterButton("primary", "Active", "active")}
        {rerenderFilterButton("secondary", "Completed", "completed")}
      </div>
    </div>
  );
});
