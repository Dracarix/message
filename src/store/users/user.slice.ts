import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    email:'',
    token:'',
    id:0,
    name:'',
}; 
const userSlise = createSlice ( {
    name: 'user',
    initialState,
    reducers:{
        setUser(state, action){
            state.email = action.payload.email;
            state.token = action.payload.token;
            state.id = action.payload.id;
            state.name = action.payload.name;
        },
        removeUser(state){
            state.email = '';
            state.token = '';
            state.id = 0;
            state.name = '';
        },
    }
})
export const {setUser, removeUser} = userSlise.actions;

export default userSlise.reducer;