import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
   name: "auth",
   initialState: {
      user: null,
      isAuthenticated: false,
      loading: false
   },
   reducers: {
      setUser: (state, action) => {
         state.user = action.payload;
         state.isAuthenticated = true;
         console.log(action.payload, "user")
      },
      logoutUser: (state, action) => {
         state.user = null
         state.isAuthenticated = false
      },
   },
})

export const { setUser, logoutUser } = slice.actions;
export default slice.reducer