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

    //

    dragAndDropTask: (state, action) => {
      const { destination, source, draggableId, datas } = action.payload;

      console.log(draggableId)

      // console.log(datas);

      // console.log("============================================");
      // console.log("destination : ");
      // console.log(destination);
      // console.log("source : ");
      // console.log(source);
      // console.log("dragableId : ");
      // console.log(draggableId);
      // console.log("============================================");

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

      // const item = datas.columns.find(
      //   (column) => column.id === source.droppableId
      // ).tasks[source.index];

         const item = datas.columns.find(
           (column) => column.id === source.droppableId
         ).tasks.find((task) => task.id === draggableId)


      if (start === finish) {
        // console.log("");
        // console.log(
        //   " =================== stay à the same colonne ==================="
        // );
        // console.log("");

        const newColumn = datas.columns
          .find((column) => column.id === source.droppableId)
          .tasks.filter((task) => task.id != item.id);

        console.log([
          ...newColumn.slice(0, destination.index),
          item,
          ...newColumn.slice(destination.index),
        ]);

        // console.log(newColumn.slice(0, destination.index));
        // console.log(newColumn.slice(destination.index));

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
        // console.log("");
        // console.log(
        //   " =================== mouve to other colonne ==================="
        // );
        // console.log("");

        // console.log(source.droppableId);
        // console.log(destination.droppableId);

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
