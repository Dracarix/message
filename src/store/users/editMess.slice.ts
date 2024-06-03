import { createSlice } from "@reduxjs/toolkit";
import { MessagesType } from "types/user";

interface ChatState {
    editMess :MessagesType["word"] | null
}

const initialState: ChatState = {
    editMess: null,
}; 

const editMessSlice = createSlice({
    name: 'editMess',
    initialState,
    reducers: {
        setEditMess(state, action) {
            state.editMess = action.payload;
        },
        removeEditMess(state) {
            state.editMess = null;
        }
    }
});

export const { setEditMess, removeEditMess } = editMessSlice.actions;

export default editMessSlice.reducer;
