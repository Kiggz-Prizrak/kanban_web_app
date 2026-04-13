import { createSlice } from "@reduxjs/toolkit";

// Génère un id local unique — préfixé "local_" pour ne jamais collisionner avec les ids BDD
export const generateLocalId = () =>
  `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const kanbanSlice = createSlice({
  name: "kanbans",
  initialState: {
    kanbans: [],
  },
  reducers: {
    addNewBoard: (state, action) => {
      const board = {
        ...action.payload,
        localId: action.payload.localId ?? generateLocalId(),
      };
      state.kanbans.push(board);
    },

    // Corrigé : recherche par localId au lieu de indexOf (fragile)
    editBoard: (state, action) => {
      const { selectedKanban, newBoard } = action.payload;
      // selectedKanban peut être un index (rétrocompat) ou un localId (string)
      const idx =
        typeof selectedKanban === "number"
          ? selectedKanban
          : state.kanbans.findIndex((kb) => kb.localId === selectedKanban);
      if (idx !== -1) {
        state.kanbans[idx] = { ...state.kanbans[idx], ...newBoard };
      }
    },

    // Corrigé : suppression par localId si string, par index si number (rétrocompat)
    deleteBoard: (state, action) => {
      const payload = action.payload;
      if (typeof payload === "number") {
        state.kanbans.splice(payload, 1);
      } else {
        state.kanbans = state.kanbans.filter((kb) => kb.localId !== payload);
      }
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
      state.kanbans[selectedKanban].columns[columnIndex].tasks = state.kanbans[
        selectedKanban
      ].columns[columnIndex].tasks.filter((e) => e.id !== id);
    },

    editTask: (state, action) => {
      const { selectedKanban, columnIndex, newTask } = action.payload;
      const taskToEdit = state.kanbans[selectedKanban].columns[
        columnIndex
      ].tasks.find((task) => task.id == newTask.id);
      if (taskToEdit) {
        taskToEdit.title = newTask.title;
        taskToEdit.description = newTask.description;
        taskToEdit.subtasks = newTask.subtasks;
      }
    },

    updateSubtask: (state, action) => {
      const { selectedKanban, columnIndex, taskId, subtaskId, isChecked } =
        action.payload;
      const task = state.kanbans[selectedKanban].columns[
        columnIndex
      ].tasks.find((task) => task.id === taskId);
      if (task) {
        const subtask = task.subtasks.find((s) => s.id === subtaskId);
        if (subtask) subtask.isChecked = isChecked;
      }
    },

    dragAndDropTask: (state, action) => {
      const { destination, source, draggableId, datas } = action.payload;
      if (!destination) return;
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      const item = datas.columns
        .find((column) => column.id === source.droppableId)
        ?.tasks.find((task) => task.id === draggableId);
      if (!item) return;

      const start = datas.columns.find((e) => e.id === source.droppableId);
      const finish = datas.columns.find(
        (e) => e.id === destination.droppableId,
      );

      if (start === finish) {
        const newTasks = datas.columns
          .find((column) => column.id === source.droppableId)
          .tasks.filter((task) => task.id != item.id);
        state.kanbans
          .find((kanban) => kanban.localId == datas.localId)
          .columns.find(
            (column) => column.id == destination.droppableId,
          ).tasks = [
          ...newTasks.slice(0, destination.index),
          item,
          ...newTasks.slice(destination.index),
        ];
      } else {
        const prevTasks = datas.columns
          .find((column) => column.id == source.droppableId)
          .tasks.filter((task) => task.id != item.id);
        state.kanbans
          .find((kanban) => kanban.localId == datas.localId)
          .columns.find((column) => column.id == source.droppableId).tasks =
          prevTasks;

        const destTasks = datas.columns.find(
          (column) => column.id === destination.droppableId,
        ).tasks;
        state.kanbans
          .find((kanban) => kanban.localId == datas.localId)
          .columns.find(
            (column) => column.id == destination.droppableId,
          ).tasks = [
          ...destTasks.slice(0, destination.index),
          item,
          ...destTasks.slice(destination.index),
        ];
      }
    },
  },
});

export const localKanbanReducer = kanbanSlice.reducer;

export const {
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
