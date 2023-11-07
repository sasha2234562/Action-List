import { asyncActionsLog } from "./auth-reducer";
import { sectorAuth } from "./selector";


const actionsLogin = {
  ...asyncActionsLog,
};
export {
  actionsLogin,
  sectorAuth
};