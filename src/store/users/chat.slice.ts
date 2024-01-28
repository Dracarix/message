import { createSlice } from "@reduxjs/toolkit";
import { OtherUserInfo } from "types/user";

interface chatSlice{
    chatID:string,
    user:OtherUserInfo,
}
const initialState:chatSlice = {
    chatID: '',
    user: {
        id: "",
        photoURL: "",
        fullName: "",
        id2: ""
    },
}; 
const generateChatId = (id1: string , id2: string) => {
    const firstId = id1.localeCompare(id2) < 0 ? id1 : id2;
    const secondId = id1.localeCompare(id2) < 0 ? id2 : id1;
    return `${firstId}${secondId}`;
  };
const chatSlise = createSlice ( {
    name: 'chat',
    initialState,
    reducers:{
        setChat(state, action){
            const { id, id2, user } = action.payload;
            state.user = user;
            state.chatID = generateChatId(id.toString(), id2.toString());
        },
        removeChat(state){
            state.chatID = '';
            state.user = {
                id: "",
                photoURL: "",
                fullName: "",
                id2: "",
            };
        }

    }
})
export const {setChat, removeChat} = chatSlise.actions;

export default chatSlise.reducer;