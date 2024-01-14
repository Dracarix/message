import {createSlice } from "@reduxjs/toolkit";

const errorReducer = createSlice({
    name: 'errorReducer',
    initialState: {
      error: null
    },
    reducers: {
      setGlobalError: (state, action) => {
        return action.payload;
      },
    },
  });
  
  export const { setGlobalError } = errorReducer.actions;
  export default errorReducer.reducer;