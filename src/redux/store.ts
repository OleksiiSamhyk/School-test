import { configureStore } from "@reduxjs/toolkit";
import visitLogSlice from "./visitLogSlice";

export const store = configureStore({
  reducer: {
    visitLogSlice: visitLogSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
