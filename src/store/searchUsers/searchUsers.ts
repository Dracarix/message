import { createSlice } from "@reduxjs/toolkit";
import { SearchUserState } from "types/user";



export interface UserSearchDispatch {
  users: SearchUserState[];
  
}

const initialState: UserSearchDispatch = {
  users: [],
};
const SearchUsersSlice = createSlice({
    name: 'SearchUsers',
    initialState,
    reducers: {
        setSearchUserData: (state, action) => {
        state.users = action.payload;
      },
    },
  });
export const { setSearchUserData } = SearchUsersSlice.actions;

// Reducer
export const searchUsersReducer = SearchUsersSlice.reducer;