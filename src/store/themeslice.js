import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    currentTheme: "darkmode",
  },
  reducers: {
    editTheme: (state) => {
      state.currentTheme =
        state.currentTheme === "darkmode" ? "lightmode" : "darkmode";
    },
  },
});

export const { editTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
