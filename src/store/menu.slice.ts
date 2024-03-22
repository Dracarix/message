import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  needMenu: false,
};

const useMediaMenu = createSlice({
  name: 'useMenu',
  initialState,
  reducers: {
    openMenu: (state) => {
      state.needMenu = true;
    },
    closeMenu: (state) => {
      state.needMenu = false;
    },
   
  },
});

export const { openMenu, closeMenu } = useMediaMenu.actions;

export default useMediaMenu.reducer;