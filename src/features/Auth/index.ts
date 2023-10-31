import { asyncActionslog } from "./auth-reducer";
import { setIsLoggedIn } from "./auth-reducer";
import { sectorAuth } from "./selector";


const actionsLogin = {
  ...asyncActionslog,
  setIsLoggedIn
};
export {
  actionsLogin,
  sectorAuth
};