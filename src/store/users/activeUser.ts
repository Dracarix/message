import { createSlice } from "@reduxjs/toolkit";

interface ChatState {
    activeUser:boolean
}

const initialState: ChatState = {
    activeUser: false,
}; 

const activeUserSlice = createSlice({
    name: 'activeUser',
    initialState,
    reducers: {
        setActive(state, action) {
            state.activeUser = action.payload;
        },
    }
});

export const { setActive } = activeUserSlice.actions;

export default activeUserSlice.reducer;
