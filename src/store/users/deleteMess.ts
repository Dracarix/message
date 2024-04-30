import { createSlice } from "@reduxjs/toolkit";
import { MessagesType } from "types/user";



const initialState:{words: MessagesType['word'][]} ={
    words: []
} ; 

const selectedMessSlice = createSlice({
    name: 'selectedMess',
    initialState,
    reducers: {
        setSelectMess(state, action) {
            state.words = action.payload;
        },
        removeSelectMess(state) {
            state.words = []

            
        }
    }
});

export const { setSelectMess, removeSelectMess } = selectedMessSlice.actions;

export default selectedMessSlice.reducer;
