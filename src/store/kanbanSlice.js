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
      const { selectedKanban, column, newTask } = action.payload;
      state.kanbans[selectedKanban].columns[column].tasks.push({ ...newTask });
    },
    deleteTask: (state, action) => {
      const { selectedKanban, columnIndex, id } = action.payload;
      const removeItem = state.kanbans[selectedKanban].columns[
        columnIndex
      ].tasks.filter((e) => e.id !== id);
      state.kanbans[selectedKanban].columns[columnIndex].tasks = removeItem;
    },
    updateSubtask: (state, action) => {
      const { selectedKanban, columnIndex, taskId, subtaskId, isChecked } =
        action.payload;

      state.kanbans[selectedKanban].columns[columnIndex].tasks
        .find((task) => task.id === taskId)
        .subtasks.find((subtask) => subtask.id === subtaskId).isChecked =
        isChecked;
    },
    editDarkmode: (state) => {
      state.darkMode = !state.darkMode;
    },

    dragAndDropTask: (state, action) => {
      const { destination, source, draggableId, datas } = action.payload;
      console.log("============================================")
      console.log("destination : ");
      console.log(destination);
      console.log("source : ");
      console.log(source);
      console.log("dragableId : ");
      console.log(draggableId);
      console.log("============================================");


      if (!destination) return;

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        console.log("no change");
        return;
      }

      const start = datas.columns.find((e) => e.id === source.droppableId);
      const finish = datas.columns.find(
        (e) => e.id === destination.droppableId
      );

      console.log("start");
      console.log(start);
      console.log("finish");
      console.log(finish);

      if (start === finish) {
        console.log("same colonne");
      }
    },
  },
});

export const kanbanReducer = kanbanSlice.reducer;

export const {
  editDarkmode,
  dragAndDropTask,
  addNewBoard,
  editBoard,
  deleteBoard,
  addNewColumn,
  addNewTask,
  deleteTask,
  updateSubtask,
} = kanbanSlice.actions;
