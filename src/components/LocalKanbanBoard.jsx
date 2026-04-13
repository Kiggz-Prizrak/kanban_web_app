import { useSelector } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";

import BoardColumn from "./BoardColumn";
import { dragAndDropTask } from "../store/localKanbanSlice";

const LocalKanbanBoard = ({
  selectedKanban,
  setNewColumnModalIsOpen,
  setEditTaskModal,
  setDeleteTaskModal,
  setTaskDetailsModal,
}) => {
  const theme = useSelector((state) => state.theme.currentTheme);
  const dispatch = useDispatch();
  const datas = useSelector(
    (state) => state.localKanban.kanbans[selectedKanban],
  );

  if (!datas) return null;

  const onDragEnd = (result) => {
    dispatch(dragAndDropTask({ ...result, datas }));
  };

  // Adapte les colonnes locales au format attendu par BoardColumn
  // BoardColumn attend { id, name, tasks[] }
  // Les colonnes locales ont le même format — on mappe juste les substasks
  const columns = datas.columns.map((col) => ({
    ...col,
    tasks: col.tasks.map((task) => ({
      ...task,
      // BoardColumn/TaskCard utilise substasks (typo back) — on normalise
      substasks:
        task.subtasks?.map((s) => ({
          id: s.id,
          title: s.name,
          isCompleted: s.isChecked ?? false,
        })) ?? [],
    })),
  }));

  return (
    <div className="board_container">
      {columns.length ? (
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            {columns.map((column, i) => (
              <BoardColumn
                key={column.id}
                column={column}
                columnIndex={i}
                boardId={null}
                isAdmin={true} // local = toujours admin
                setEditTaskModal={setEditTaskModal}
                setDeleteTaskModal={setDeleteTaskModal}
                setTaskDetailsModal={setTaskDetailsModal}
              />
            ))}
          </DragDropContext>

          <button
            className={`boardKanban_columnAdder_btn boardKanban_columnAdder_btn--${theme}`}
            onClick={() => setNewColumnModalIsOpen(true)}
          >
            + New Column
          </button>
        </>
      ) : (
        <div className="board_unless_column">
          <h3>This board is empty. Create a new column to get started.</h3>
          <button
            className="header_taskAdder"
            onClick={() => setNewColumnModalIsOpen(true)}
          >
            + Add New Column
          </button>
        </div>
      )}
    </div>
  );
};

export default LocalKanbanBoard;
