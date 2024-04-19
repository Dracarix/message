import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  isOpen: false,
  needReAuth: false,
  needQuit: false,
  openCompletSet: false,
};

const isModalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
      openComplSetProf:(state)=>{
        state.isOpen = true;
        state.needQuit = false;
        state.needReAuth = false;
        state.openCompletSet = true;
      },
      openReAuth:(state)=>{
        state.isOpen = true;
        state.needQuit = false;
        state.needReAuth = true;
        state.openCompletSet = false;
      },
      openQuitAccount:(state)=>{
        state.isOpen = true;
        state.needQuit = true;
        state.needReAuth = false;
        state.openCompletSet = false;
      },
      closeModal: (state) => {
        state.isOpen = false;
        state.needQuit = false;
        state.needReAuth = false;
        state.openCompletSet = false;
      },
    },
  });
  
  export const { openReAuth, closeModal, openQuitAccount, openComplSetProf } = isModalSlice.actions;

    export default isModalSlice.reducer;