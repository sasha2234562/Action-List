import {AppRootStateType} from "./store";

export const selectStatus = (state: AppRootStateType)=> state.app.status
export const selectIsInitialased = (state: AppRootStateType)=> state.app.isInitialized