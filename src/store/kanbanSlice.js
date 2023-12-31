import { createSlice } from "@reduxjs/toolkit";

const kanbanSlice = createSlice({
  name: "kanbans",
  initialState: {
    kanbans: [],
    theme: { currentTheme: "darkmode", themeList: ["darkmode", "lightmode"] },
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
    editTask: (state, action) => {
      const { selectedKanban, columnIndex, newTask } = action.payload;

      const taskToEdit = state.kanbans[selectedKanban].columns[
        columnIndex
      ].tasks.find((task) => task.id == newTask.id);

      taskToEdit.title = newTask.title;
      taskToEdit.description = newTask.description;
      taskToEdit.subtasks = newTask.subtasks;
    },
    updateSubtask: (state, action) => {
      const { selectedKanban, columnIndex, taskId, subtaskId, isChecked } =
        action.payload;

      state.kanbans[selectedKanban].columns[columnIndex].tasks
        .find((task) => task.id === taskId)
        .subtasks.find((subtask) => subtask.id === subtaskId).isChecked =
        isChecked;
    },
    editTheme: (state) => {
      state.theme.currentTheme = state.theme.themeList.find(
        (theme) => theme != state.theme.currentTheme
      );
    },

    dragAndDropTask: (state, action) => {
      const { destination, source, draggableId, datas } = action.payload;

      if (!destination) return;

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const start = datas.columns.find((e) => e.id === source.droppableId);
      const finish = datas.columns.find(
        (e) => e.id === destination.droppableId
      );

      const item = datas.columns
        .find((column) => column.id === source.droppableId)
        .tasks.find((task) => task.id === draggableId);

      if (start === finish) {
        const newColumn = datas.columns
          .find((column) => column.id === source.droppableId)
          .tasks.filter((task) => task.id != item.id);

        state.kanbans
          .find((kanban) => kanban.board == datas.board)
          .columns.find(
            (column) => column.id == destination.droppableId
          ).tasks = [
          ...newColumn.slice(0, destination.index),
          item,
          ...newColumn.slice(destination.index),
        ];
      } else {
        const previousColumn = datas.columns
          .find((column) => column.id == source.droppableId)
          .tasks.filter((task) => task.id != item.id);

        state.kanbans
          .find((kanban) => kanban.board == datas.board)
          .columns.find((column) => column.id == source.droppableId).tasks =
          previousColumn;

        const newColumn = datas.columns.find(
          (column) => column.id === destination.droppableId
        ).tasks;

        state.kanbans
          .find((kanban) => kanban.board == datas.board)
          .columns.find(
            (column) => column.id == destination.droppableId
          ).tasks = [
          ...newColumn.slice(0, destination.index),
          item,
          ...newColumn.slice(destination.index),
        ];
      }
    },
  },
});

export const kanbanReducer = kanbanSlice.reducer;

export const {
  editTheme,
  dragAndDropTask,
  addNewBoard,
  editBoard,
  deleteBoard,
  addNewColumn,
  addNewTask,
  deleteTask,
  editTask,
  updateSubtask,
} = kanbanSlice.actions;
