import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    need: true,
  };
  const mainInputDisabled = createSlice({
      name: 'needMainInput',
      initialState,
      reducers: {
          setDisabledInput: (state) => {
          state.need = state.need = false;
        },
        setWorkedInput: (state) => {
            state.need = state.need = true;
          },
      },
    });
  export const { setDisabledInput , setWorkedInput} = mainInputDisabled.actions;

  export const needMainInput = mainInputDisabled.reducer;