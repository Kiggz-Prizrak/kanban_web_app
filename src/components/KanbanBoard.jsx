import {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext } from "@hello-pangea/dnd";

import BoardColumn from "./BoardColumn";
import { getBoardById, moveTask } from "../api/boards";
import { dragAndDropTask } from "../store/localKanbanSlice";

const KanbanBoard = forwardRef(function KanbanBoard(
  {
    // API props
    boardId,
    // Local props
    selectedKanban,
    // Commun
    isAdmin,
    isLocal = false,
    setNewColumnModalIsOpen,
    setEditTaskModal,
    setDeleteTaskModal,
    setTaskDetailsModal,
    onColumnsChange,
  },
  ref,
) {
  const theme = useSelector((state) => state.theme.currentTheme);
  const dispatch = useDispatch();

  // ---- Données locales depuis Redux ----
  const localKanban = useSelector((state) =>
    isLocal ? state.localKanban.kanbans[selectedKanban] : null,
  );

  // ---- Données API ----
  const [apiBoard, setApiBoard] = useState(null);
  const [isLoading, setIsLoading] = useState(!isLocal);
  const [error, setError] = useState(null);

  // Le board affiché — local ou API
  const board = isLocal ? localKanban : apiBoard;

  // ---- Fetch API ----
  const fetchBoard = useCallback(async () => {
    if (isLocal || !boardId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getBoardById(boardId);
      setApiBoard(data);
      onColumnsChange?.(data.columns?.length ?? 0);
    } catch (err) {
      setError(err.message || "Erreur lors du chargement du board");
    } finally {
      setIsLoading(false);
    }
  }, [boardId, isLocal, onColumnsChange]);

  // Expose fetchBoard et hasColumns au parent via ref (API uniquement)
  useImperativeHandle(
    ref,
    () => ({
      fetchBoard,
      get hasColumns() {
        return (apiBoard?.columns?.length ?? 0) > 0;
      },
    }),
    [fetchBoard, apiBoard],
  );

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  // Notifie le parent quand les colonnes locales changent
  useEffect(() => {
    if (isLocal) {
      onColumnsChange?.(localKanban?.columns?.length ?? 0);
    }
  }, [isLocal, localKanban?.columns?.length, onColumnsChange]);

  // ---- Drag & drop ----
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (isLocal) {
      // Local — dispatch Redux directement
      dispatch(dragAndDropTask({ ...result, datas: localKanban }));
    } else {
      // API — mise à jour optimiste + appel serveur
      const sourceColumnId = Number(source.droppableId);
      const destinationColumnId = Number(destination.droppableId);
      const taskId = Number(draggableId);
      const destinationIndex = destination.index;

      setApiBoard((prev) => {
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
        destCol.tasks.splice(
          destinationIndex,
          0,
          sourceColumnId === destinationColumnId
            ? movedTask
            : { ...movedTask, columnId: destinationColumnId },
        );
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
    }
  };

  // ---- Normalisation colonnes locales ----
  // Le back retourne substasks[].title + isCompleted
  // Le local stocke subtasks[].name + isChecked
  // BoardColumn/TaskCard s'attend au format back — on normalise
  const normalizedColumns = isLocal
    ? (localKanban?.columns ?? []).map((col) => ({
        ...col,
        tasks: col.tasks.map((task) => ({
          ...task,
          substasks: (task.subtasks ?? []).map((s) => ({
            id: s.id,
            title: s.name,
            isCompleted: s.isChecked ?? false,
          })),
        })),
      }))
    : (board?.columns ?? []);

  // ---- Rendu ----
  if (!isLocal && isLoading) {
    return (
      <div className="board_container">
        <p className="board_loading">Chargement...</p>
      </div>
    );
  }

  if (!isLocal && error) {
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
      {normalizedColumns.length ? (
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            {normalizedColumns.map((column, i) => (
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
