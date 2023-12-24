import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    email:'',
    token:'',
    id:0,
}; 
const userSlise = createSlice ( {
    name: 'user',
    initialState,
    reducers:{
        setUser(state, action){
            state.email = action.payload.email;
            state.token = action.payload.token;
            state.id = action.payload.id;
        },
        removeUser(state){
            state.email = '';
            state.token = '';
            state.id = 0;
        },
    }
})
export const {setUser, removeUser} = userSlise.actions;

export default userSlise.reducer;