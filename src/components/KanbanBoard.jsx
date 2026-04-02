import {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useSelector } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";

import BoardColumn from "./BoardColumn";
import { getBoardById, moveTask } from "../api/boards";

const KanbanBoard = forwardRef(function KanbanBoard(
  {
    boardId,
    isAdmin,
    setNewColumnModalIsOpen,
    setEditTaskModal,
    setDeleteTaskModal,
    setTaskDetailsModal,
  },
  ref,
) {
  const theme = useSelector((state) => state.theme.currentTheme);

  const [board, setBoard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBoard = useCallback(async () => {
    if (!boardId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getBoardById(boardId);
      setBoard(data);
    } catch (err) {
      setError(err.message || "Erreur lors du chargement du board");
    } finally {
      setIsLoading(false);
    }
  }, [boardId]);

  // Expose fetchBoard au parent via ref
  useImperativeHandle(ref, () => ({ fetchBoard }), [fetchBoard]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const sourceColumnId = Number(source.droppableId);
    const destinationColumnId = Number(destination.droppableId);
    const taskId = Number(draggableId);
    const destinationIndex = destination.index;

    // Mise à jour optimiste
    setBoard((prev) => {
      if (!prev) return prev;

      const columns = prev.columns.map((col) => ({
        ...col,
        tasks: col.tasks.map((task) => ({ ...task })),
      }));

      const sourceCol = columns.find((c) => c.id === sourceColumnId);
      const destCol = columns.find((c) => c.id === destinationColumnId);

      if (!sourceCol || !destCol) return prev;

      const [movedTask] = sourceCol.tasks.splice(source.index, 1);

      if (!movedTask) return prev;

      const updatedTask =
        sourceColumnId === destinationColumnId
          ? movedTask
          : { ...movedTask, columnId: destinationColumnId };

      destCol.tasks.splice(destinationIndex, 0, updatedTask);

      return { ...prev, columns };
    });

    try {
      await moveTask(boardId, taskId, {
        sourceColumnId,
        destinationColumnId,
        destinationIndex,
      });
    } catch (err) {
      console.error("moveTask failed:", err);
      fetchBoard();
    }
  };

  if (isLoading) {
    return (
      <div className="board_container">
        <p className="board_loading">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="board_container">
        <p className="board_error">{error}</p>
        <button className="form_button_submit" onClick={fetchBoard}>
          Réessayer
        </button>
      </div>
    );
  }

  if (!board) return null;

  return (
    <div className="board_container">
      {board.columns.length ? (
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            {board.columns.map((column, i) => (
              <BoardColumn
                key={column.id}
                column={column}
                columnIndex={i}
                boardId={boardId}
                isAdmin={isAdmin}
                setEditTaskModal={setEditTaskModal}
                setDeleteTaskModal={setDeleteTaskModal}
                setTaskDetailsModal={setTaskDetailsModal}
              />
            ))}
          </DragDropContext>

          {isAdmin && (
            <button
              className={`boardKanban_columnAdder_btn boardKanban_columnAdder_btn--${theme}`}
              onClick={() => setNewColumnModalIsOpen(true)}
            >
              + New Column
            </button>
          )}
        </>
      ) : (
        <div className="board_unless_column">
          <h3>This board is empty. Create a new column to get started.</h3>
          {isAdmin && (
            <button
              className="header_taskAdder"
              onClick={() => setNewColumnModalIsOpen(true)}
            >
              + Add New Column
            </button>
          )}
        </div>
      )}
    </div>
  );
});

export default KanbanBoard;
