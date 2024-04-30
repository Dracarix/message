import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  isOpen: false,
  needReAuth: false,
  needQuit: false,
  openCompletSet: false,
  errModal: false,
  ConfirmDelMess:false,
};

const isModalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
      openConfirmDelMess:(state)=>{
        state.isOpen = true;
        state.needQuit = false;
        state.needReAuth = false;
        state.openCompletSet = false;
        state.errModal = false;
        state.ConfirmDelMess = true;
      },
      openErrModal:(state)=>{
        state.isOpen = true;
        state.needQuit = false;
        state.needReAuth = false;
        state.openCompletSet = false;
        state.errModal = true;
        state.ConfirmDelMess = false;
      },
      openComplSetProf:(state)=>{
        state.isOpen = true;
        state.needQuit = false;
        state.needReAuth = false;
        state.openCompletSet = true;
        state.errModal = false;
        state.ConfirmDelMess = false;
      },
      openReAuth:(state)=>{
        state.isOpen = true;
        state.needQuit = false;
        state.needReAuth = true;
        state.openCompletSet = false;
        state.errModal = false;
        state.ConfirmDelMess = false;
      },
      openQuitAccount:(state)=>{
        state.isOpen = true;
        state.needQuit = true;
        state.needReAuth = false;
        state.openCompletSet = false;
        state.errModal = false;
        state.ConfirmDelMess = false;
      },
      closeModal: (state) => {
        state.isOpen = false;
        state.needQuit = false;
        state.ConfirmDelMess = false;
        state.needReAuth = false;
        state.openCompletSet = false;
        state.errModal = false;
      },
    },
  });
  
  export const { openReAuth, closeModal, openQuitAccount, openComplSetProf,openErrModal,openConfirmDelMess } = isModalSlice.actions;

    export default isModalSlice.reducer;