import { AppRootStateType } from "app/types";


export const selectTasks = (state: AppRootStateType) => state.tasks;
