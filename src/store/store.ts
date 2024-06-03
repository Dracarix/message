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
import editMessSlice from './users/editMess.slice';
import allChatsSlice from './users/allUsers.slice';
import activeUserSlice from './users/activeUser'


export const store = configureStore({
    reducer:{
        //пользователь что сейчас в системе
        user:userReduser,
        // глобальный лодер и отловщик ошибок
        process:useProcess,
        // еррор пэйдж  ,пока не нужен 
        errorReducer:setGlobalError,
        // Серч инпут в лояуте , с массивом обьектов пользователей которых нашли
        setSearchUsers: searchUsersReducer,
        // модалка глобальная 
        isModalReduser: isModalSlice,
        // чат чтобы сохранять текущий чат из UserChat и чат айди сразу
        chat:chatSlice,
        // лодер для страницы со всеми чатами
        processMessages:useMessageProcess,
        // темы для глобального переноса по проекту
        theme: themeReducer,
        // дизеблед для инпута из лояута
        needMainInput: needMainInput,
        // меню для мобильлки 
        useMenu: useMediaMenu,
        // выделенные сообщения в чате 
        selectedMess:selectedMessSlice,
        // для редактирования сообщения 
        editMess: editMessSlice,
        // для сохранения глобально всех чатов но в процессе отказался тк там подписка на изменения и глобально наждый раз это сохранят , ну не
        allChats: allChatsSlice,
        // для Уведомлений звуковых,тк гугл запретил не активному пользователю не присылать уведы
        activeUser:activeUserSlice
    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;