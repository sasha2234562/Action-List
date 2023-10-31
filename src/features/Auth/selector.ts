import { AppRootStateType } from "app/store";

export const sectorAuth = (state: AppRootStateType): boolean=> state.auth.isLoggedIn