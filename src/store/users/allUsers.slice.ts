import { createSlice } from "@reduxjs/toolkit";
import {  UserState } from "types/user";

interface ChatState {
    allChats:UserState[] | null
}

const initialState: ChatState = {
    allChats: null,
}; 

const allChatsSlice = createSlice({
    name: 'allChats',
    initialState,
    reducers: {
        setAllChats(state, action) {
            state.allChats = action.payload;
        },
        removeAllChats(state) {
            state.allChats = null;
        }
    }
});

export const { setAllChats, removeAllChats } = allChatsSlice.actions;

export default allChatsSlice.reducer;
