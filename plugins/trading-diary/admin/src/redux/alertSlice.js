import { createSlice } from "@reduxjs/toolkit";

export const alertSlice = createSlice({
  name: "alert",
  initialState: {
    variant: "",
    content: "",
  },
  reducers: {
    alertSuccess: (state, action) => {
      state.variant = "success";
      state.content = action.payload;
    },
    alertError: (state, action) => {
      state.variant = "error";
      state.content = action.payload;
    },
    resetAlert: (state, action) => {
      state.variant = "";
      state.content = "";
    },
  },
});

export const { alertSuccess, alertError, resetAlert } = alertSlice.actions;

export default alertSlice.reducer;
