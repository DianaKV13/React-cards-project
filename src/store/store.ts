import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

const RootReducer = combineReducers({
  user: userReducer,
});

const store = configureStore({
  reducer: RootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type TRootState = ReturnType<typeof RootReducer>;
export default store;
