import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    email:null,
    token:'',
    id:0,
    fullName:'',
    photoURL: '',
    firstName: '',
    lastName: '',
}; 
const userSlise = createSlice ( {
    name: 'user',
    initialState,
    reducers:{
        setUser(state, action){
            state.email = action.payload.email;
            state.token = action.payload.token;
            state.id = action.payload.id;
            state.fullName = action.payload.fullName;
            state.photoURL = action.payload.photoURL;
            state.firstName = action.payload.firstName;

        },
        removeUser(state){
            state.email = null;
            state.token = '';
            state.id = 0;
            state.fullName = '';
            state.photoURL = '';
            state.firstName = '';
            state.lastName = '';
        },
    }
})
export const {setUser, removeUser} = userSlise.actions;

export default userSlise.reducer;