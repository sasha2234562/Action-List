import { AppRootStateType } from "app/types";

export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn;
