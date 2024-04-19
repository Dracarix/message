import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loadingMess: false,
};

const useMessageProcess = createSlice({
  name: 'useProcess',
  initialState,
  reducers: {
    StartMessages: (state) => {
      state.loadingMess = true;
    },
    FinishMessages: (state) => {
      state.loadingMess = false;
    },
   
  },
});

export const { StartMessages, FinishMessages } = useMessageProcess.actions;

export default useMessageProcess.reducer;