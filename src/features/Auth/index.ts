import { asyncActionsLog } from "./auth-reducer";
import { setIsLoggedIn } from "./auth-reducer";
import { sectorAuth } from "./selector";


const actionsLogin = {
  ...asyncActionsLog,
  setIsLoggedIn
};
export {
  actionsLogin,
  sectorAuth
};