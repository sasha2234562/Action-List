import React, { ChangeEvent, useCallback } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import { TaskStatuses, TaskType } from "api/todolists-api";

type TaskPropsType = {
  task: TaskType
  todolistId: string
  changeTaskStatus: (arg: { taskId: string, domainModel: { status: TaskStatuses }, todolistId: string }) => void
  changeTaskTitle: (arg: { taskId: string, domainModel: { title: string }, todolistId: string }) => void
  removeTask: (arg: { taskId: string, todolistId: string }) => void
}
export const Task = React.memo((props: TaskPropsType) => {
  const onClickHandler = useCallback(
    () => props.removeTask({ taskId: props.task.id, todolistId: props.todolistId }),
    [props.task.id, props.todolistId]
  );

  const onChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let newIsDoneValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
      props.changeTaskStatus({
        taskId: props.task.id,
        domainModel: { status: newIsDoneValue },
        todolistId: props.todolistId
      });
    },
    [props.task.id, props.todolistId]
  );

  const onTitleChangeHandler = useCallback(
    (newValue: string) => {
      props.changeTaskTitle({ taskId: props.task.id, domainModel: { title: newValue }, todolistId: props.todolistId });
    },
    [props.task.id, props.todolistId]
  );

  return (
    <div
      key={props.task.id}
      className={props.task.status === TaskStatuses.Completed ? "is-done" : ""}
    >
      <Checkbox
        checked={props.task.status === TaskStatuses.Completed}
        color="primary"
        onChange={onChangeHandler}
      />

      <EditableSpan value={props.task.title} onChange={onTitleChangeHandler} />
      <IconButton onClick={onClickHandler}>
        <Delete />
      </IconButton>
    </div>
  );
});
