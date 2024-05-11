import { createSlice } from "@reduxjs/toolkit";
import { ChatObject } from "types/user";

interface ChatState {
    chats:ChatObject[] | null
}

const initialState: ChatState = {
    chats: null,
}; 

const userChatSlice = createSlice({
    name: 'userChats',
    initialState,
    reducers: {
        setUserChats(state, action) {
            state.chats = action.payload;
        },
        removeUserChats(state) {
            state.chats = null;
        }
    }
});

export const { setUserChats, removeUserChats } = userChatSlice.actions;

export default userChatSlice.reducer;
