import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  loading: false,
  error: null ,
};

const useProcess = createSlice({
  name: 'useProcess',
  initialState,
  reducers: {
    ProcessDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    ProcessDataSuccess: (state) => {
      state.loading = false;
    },
    ProcessDataFailure: (state, action) => {
      state.loading = false;
      state.error = null;
      state.error = action.payload;
    },
  },
});

export const { ProcessDataStart, ProcessDataSuccess, ProcessDataFailure } = useProcess.actions;

export default useProcess.reducer;