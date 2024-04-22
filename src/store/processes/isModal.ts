import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  isOpen: false,
  needReAuth: false,
  needQuit: false,
  openCompletSet: false,
  errModal: false,
};

const isModalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
      openErrModal:(state)=>{
        state.isOpen = true;
        state.needQuit = false;
        state.needReAuth = false;
        state.openCompletSet = false;
        state.errModal = true;
      },
      openComplSetProf:(state)=>{
        state.isOpen = true;
        state.needQuit = false;
        state.needReAuth = false;
        state.openCompletSet = true;
        state.errModal = false;
      },
      openReAuth:(state)=>{
        state.isOpen = true;
        state.needQuit = false;
        state.needReAuth = true;
        state.openCompletSet = false;
        state.errModal = false;
      },
      openQuitAccount:(state)=>{
        state.isOpen = true;
        state.needQuit = true;
        state.needReAuth = false;
        state.openCompletSet = false;
        state.errModal = false;
      },
      closeModal: (state) => {
        state.isOpen = false;
        state.needQuit = false;
        state.needReAuth = false;
        state.openCompletSet = false;
        state.errModal = false;
      },
    },
  });
  
  export const { openReAuth, closeModal, openQuitAccount, openComplSetProf,openErrModal } = isModalSlice.actions;

    export default isModalSlice.reducer;