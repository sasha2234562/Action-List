import { AppRootStateType } from "app/store";
import { RequestStatusType } from "app/app-reducer";

export const selectStatus = (state: AppRootStateType) : RequestStatusType => state.app.status
export const selectIsInitialized = (state: AppRootStateType) : boolean => state.app.isInitialized