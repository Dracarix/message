import { createSlice } from "@reduxjs/toolkit";
import { OtherUserInfo } from "types/user";

interface ChatState {
    user: OtherUserInfo;
    chatID: string;
}

const initialState: ChatState = {
    chatID:'',
    user: {
        id: "",
        photoURL: "",
        fullName: "",
    },
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
            state.user = {
                id: "",
                photoURL: "",
                fullName: "",
            };
        }
    }
});

export const { setChat, removeChat } = chatSlice.actions;

export default chatSlice.reducer;
