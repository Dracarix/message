import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  isOpen: false,
  needReAuth: false,
};

const isModalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
      openReAuth:(state)=>{
        state.needReAuth = true;
        state.isOpen = true;
      },
      closeModal: (state) => {
        state.isOpen = false;
        state.needReAuth = false;
      },
    },
  });
  
  export const { openReAuth, closeModal } = isModalSlice.actions;

    export default isModalSlice.reducer;