import { configureStore } from "@reduxjs/toolkit";
import userReduser from "./users/user.slice"
import useProcess from './processes/process'
import setGlobalError from './error'
import { searchUsersReducer } from "./searchUsers/searchUsers";
import isModalSlice from './processes/isModal';
import chatSlice from "./users/chat.slice";
import useMessageProcess from './processes/processedMessages'
import themeReducer from '../Components/Theme/theme.slice'
import {needMainInput} from './searchUsers/mainInputDisabled'
import useMediaMenu from './menu.slice';
import selectedMessSlice from './users/deleteMess';
import userChatSlice from './users/thisUserChat.slice';
import allChatsSlice from './users/allUsers.slice';
import activeUserSlice from './users/activeUser'


export const store = configureStore({
    reducer:{
        user:userReduser,
        process:useProcess,
        errorReducer:setGlobalError,
        setSearchUsers: searchUsersReducer,
        isModalReduser: isModalSlice,
        chat:chatSlice,
        processMessages:useMessageProcess,
        theme: themeReducer,
        needMainInput: needMainInput,
        useMenu: useMediaMenu,
        selectedMess:selectedMessSlice,
        userChats: userChatSlice,
        allChats: allChatsSlice,
        activeUser:activeUserSlice
    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;