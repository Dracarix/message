import { configureStore } from "@reduxjs/toolkit";
import userReduser from "./users/user.slice"
import { UserState } from "../types/user";

export interface RootStateType {
    user: UserState;
    // Другие редюсеры и их состояния, если есть
  }
export const store = configureStore<RootStateType>({
    reducer:{
        user:userReduser,
    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;