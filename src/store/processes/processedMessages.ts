import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
};

const useMessageProcess = createSlice({
  name: 'useProcess',
  initialState,
  reducers: {
    StartMessages: (state) => {
      state.loading = true;
    },
    FinishMessages: (state) => {
      state.loading = false;
    },
   
  },
});

export const { StartMessages, FinishMessages } = useMessageProcess.actions;

export default useMessageProcess.reducer;