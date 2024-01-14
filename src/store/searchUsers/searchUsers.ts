import { createSlice } from "@reduxjs/toolkit";

interface searchUserData {
    name: string;
    photoURL: string;
  }

const initialState: { data: searchUserData | null } = {
    data: null,
}

const SearchUsers = createSlice({
    name: 'SearchUsers',
    initialState,
    reducers: {
        setSearchUserData: (state, action) => {
            // Modify the state with the received data
            return {
                ...state,
                userData: action.payload
            };
        }

    }
});
export const { setSearchUserData } = SearchUsers.actions;

// Reducer
export const searchUsersReducer = SearchUsers.reducer;