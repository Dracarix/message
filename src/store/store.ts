import { configureStore } from "@reduxjs/toolkit";
import userReduser from "./users/user.slice"
import useProcess from './processes/process'
import setGlobalError from './error'
import { searchUsersReducer } from "./searchUsers/searchUsers";
import isModalSlice from './processes/isModal';
import chatSlice from "./users/chat.slice";

export const store = configureStore({
    reducer:{
        user:userReduser,
        process:useProcess,
        errorReducer:setGlobalError,
        setSearchUsers: searchUsersReducer,
        isModalReduser: isModalSlice,
        chat:chatSlice,
    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;