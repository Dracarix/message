import { createSlice } from "@reduxjs/toolkit";
import { ChatObject, ChatObjectItem } from "types/user";

type initialStateTypes ={
  confirmDelChatObj: ChatObject | null,
  isOpen: boolean,
  needReAuth: boolean,
  needQuit: boolean,
  openCompletSet: boolean,
  errModal: boolean,
  ConfirmDelMess:boolean,

}
const initialState:initialStateTypes = {
  isOpen: false,
  needReAuth: false,
  needQuit: false,
  openCompletSet: false,
  errModal: false,
  ConfirmDelMess:false,
  confirmDelChatObj: null
};

const isModalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
      openConfirmDelChat:(state, actions)=>{
        state.isOpen = true;
        state.needQuit = false;
        state.needReAuth = false;
        state.openCompletSet = false;
        state.errModal = false;
        state.ConfirmDelMess = false;
        state.confirmDelChatObj = actions.payload;
      },
      openConfirmDelMess:(state)=>{
        state.isOpen = true;
        state.ConfirmDelMess = true;
        state.needQuit = false;
        state.needReAuth = false;
        state.openCompletSet = false;
        state.errModal = false;
        state.confirmDelChatObj = null;
      },
      openErrModal:(state)=>{
        state.isOpen = true;
        state.errModal = true;
        state.needQuit = false;
        state.needReAuth = false;
        state.openCompletSet = false;
        state.ConfirmDelMess = false;
        state.confirmDelChatObj = null;
      },
      openComplSetProf:(state)=>{
        state.isOpen = true;
        state.openCompletSet = true;
        state.needQuit = false;
        state.needReAuth = false;
        state.errModal = false;
        state.ConfirmDelMess = false;
        state.confirmDelChatObj = null;
      },
      openReAuth:(state)=>{
        state.isOpen = true;
        state.needReAuth = true;
        state.needQuit = false;
        state.openCompletSet = false;
        state.errModal = false;
        state.ConfirmDelMess = false;
        state.confirmDelChatObj = null;
      },
      openQuitAccount:(state)=>{
        state.isOpen = true;
        state.needQuit = true;
        state.needReAuth = false;
        state.confirmDelChatObj = null;
        state.openCompletSet = false;
        state.errModal = false;
        state.ConfirmDelMess = false;
      },
      closeModal: (state) => {
        state.isOpen = false;
        state.needQuit = false;
        state.confirmDelChatObj = null;
        state.ConfirmDelMess = false;
        state.needReAuth = false;
        state.openCompletSet = false;
        state.errModal = false;
      },
    },
  });
  
  export const { 
    openReAuth, 
    closeModal, 
    openQuitAccount, 
    openComplSetProf,
    openErrModal,
    openConfirmDelMess ,
    openConfirmDelChat,

  } = isModalSlice.actions;

    export default isModalSlice.reducer;