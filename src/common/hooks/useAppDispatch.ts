import { useDispatch } from "react-redux";
import { AppDispatch } from "app/types";

export const useAppDispatch: () => AppDispatch = useDispatch;
