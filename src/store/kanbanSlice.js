import { createSlice } from "@reduxjs/toolkit";

const kanbanSlice = createSlice({
  name: "kanbans",
  initialState: {
    kanbans: [],
    darkMode: true,
  },
  reducers: {
    addNewBoard: (state, action) => {
      state.kanbans.push({ ...action.payload });
    },
    editBoard: (state, action) => {
      state.kanbans = [
        ...state.kanbans.filter(
          (e) => state.kanbans.indexOf(e) != action.payload.selectedKanban
        ),
        action.payload.newBoard,
      ];
    },
    deleteBoard: (state, action) => {
      const removeItem = state.kanbans.filter(
        (item) => state.kanbans.indexOf(item) !== action.payload
      );
      state.kanbans = removeItem;
    },
    addNewColumn: (state, action) => {
      state.kanbans[action.payload.index].columns.push({
        ...action.payload.newColumn,
      });
    },
    addNewTask: (state, action) => {
      state.kanbans[action.payload.selectedKanban].columns[
        action.payload.column
      ].tasks.push({ ...action.payload.newTask });
    },
    deleteTask: (state, action) => {
      const removeItem = state.kanbans[action.payload.selectedKanban].columns[
        action.payload.columnIndex
      ].tasks.filter((e) => e.id !== action.payload.id)
      state.kanbans[action.payload.selectedKanban].columns[action.payload.columnIndex].tasks = removeItem
    },
    editDarkmode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const kanbanReducer = kanbanSlice.reducer;

export const {
  editDarkmode,
  addNewBoard,
  editBoard,
  deleteBoard,
  addNewColumn,
  addNewTask,
  deleteTask,
} = kanbanSlice.actions;
