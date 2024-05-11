import { createSlice } from "@reduxjs/toolkit";
import { OtherUserInfo } from "types/user";

interface ChatState {
    user: OtherUserInfo ;
    chatID: string | null;
}

const initialState: ChatState = {
    chatID:null,
    user: null,
}; 

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChat(state, action) {
            const { chatID, user } = action.payload;
            state.user = user;
            state.chatID = chatID;
        },
        removeChat(state) {
            state.chatID = '';
            state.user = null;
        }
    }
});

export const { setChat, removeChat } = chatSlice.actions;

export default chatSlice.reducer;
