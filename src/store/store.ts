import { configureStore } from "@reduxjs/toolkit";
import userReduser from "./users/user.slice"

export const store = configureStore({
    reducer:{
        user:userReduser,
    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;