import { configureStore, ThunkAction, AnyAction } from "@reduxjs/toolkit";
import { studentSliceReducer } from "./studentSlice";
import { classIDsSliceReducer } from "./classIDsSlice";
import { studentIDsSliceReducer } from "./studentIds";
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";
export const store = configureStore({
  reducer: {
    studentInput: studentSliceReducer,
    classIds: classIDsSliceReducer,
    studentIdsandClassnames: studentIDsSliceReducer,
  },
});
export default store;
type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppThunk = ThunkAction<void, RootState, unknown, AnyAction>;
