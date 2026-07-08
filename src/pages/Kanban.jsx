import { useLoaderData } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useRef, useCallback } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import KanbanBoard from "../components/KanbanBoard";

import AddBoard from "../components/modal/board/AddBoard";
import EditBoard from "../components/modal/board/EditBoard";
import DeleteBoard from "../components/modal/board/DeleteBoard";
import AddColumn from "../components/modal/columns/AddColums";
import AddTask from "../components/modal/tasks/AddTask";
import DeleteTask from "../components/modal/tasks/DeleteTask";
import TaskEditor from "../components/modal/tasks/TaskEditor";
import TaskDetailsModal from "../components/modal/Tasks/TaskDetailsModal";
import MembersModal from "../components/modal/members/MembersModal";

import { useAuth } from "../context/AuthContext";

const parseKey = (key) => {
  if (!key) return { type: null, id: null };
  const [type, id] = key.split("__");
  return { type, id };
};

const Kanban = () => {
  const userBoards = useLoaderData(); // null si non connecté
  const theme = useSelector((state) => state.theme.currentTheme);
  const localKanbans = useSelector((state) => state.localKanban.kanbans);
  const { user } = useAuth();

  const defaultKey = userBoards?.[0]?.board?.id
    ? `api__${userBoards[0].board.id}`
    : localKanbans?.[0]?.localId
      ? `local__${localKanbans[0].localId}`
      : null;

  const [selectedBoardKey, setSelectedBoardKey] = useState(defaultKey);
  const { type: boardType, id: boardId } = parseKey(selectedBoardKey);

  const isLocalBoard = boardType === "local";
  const isApiBoard = boardType === "api";

  // ---- Ref KanbanBoard (API uniquement) ----
  const kanbanBoardRef = useRef(null);
  const [hasColumns, setHasColumns] = useState(false);

  const handleBoardRefresh = useCallback(async () => {
    await kanbanBoardRef.current?.fetchBoard();
    setHasColumns(kanbanBoardRef.current?.hasColumns ?? false);
  }, []);

  const handleColumnsChange = useCallback(
    (count) => setHasColumns(count > 0),
    [],
  );

  // ---- Modals ----
  const [newBoardModalIsOpen, setNewBoardModalIsOpen] = useState(false);
  const [editBoardModalIsOpen, setEditBoardModalIsOpen] = useState(false);
  const [deleteBoardModalIsOpen, setDeleteBoardModalIsOpen] = useState(false);
  const [newColumnModalIsOpen, setNewColumnModalIsOpen] = useState(false);
  const [newTaskModalIsOpen, setNewTaskModalIsOpen] = useState(false);
  const [membersModalIsOpen, setMembersModalIsOpen] = useState(false);

  const [editTaskModal, setEditTaskModal] = useState({
    open: false,
    taskId: null,
    columnId: null,
  });
  const [deleteTaskModal, setDeleteTaskModal] = useState({
    open: false,
    taskId: null,
    columnId: null,
  });
  const [taskDetailsModal, setTaskDetailsModal] = useState({
    open: false,
    taskId: null,
    columnId: null,
  });

  // Modals locaux — portent selectedKanban + columnIndex + id (format Redux)
  const [localEditTaskModal, setLocalEditTaskModal] = useState({
    open: false,
    columnIndex: 0,
    id: null,
    selectedKanban: 0,
  });
  const [localDeleteTaskModal, setLocalDeleteTaskModal] = useState({
    open: false,
    columnIndex: 0,
    id: null,
    selectedKanban: 0,
  });
  const [localTaskDetailsModal, setLocalTaskDetailsModal] = useState({
    open: false,
    columnIndex: 0,
    id: null,
    selectedKanban: 0,
  });

  // ---- Board courant ----
  const currentApiMembership = userBoards?.find(
    (ub) => String(ub.board?.id) === String(boardId),
  );
  const isAdmin = isApiBoard ? currentApiMembership?.role === "admin" : true;
  const selectedBoardName = isApiBoard
    ? (currentApiMembership?.board?.name ?? "")
    : (localKanbans.find((kb) => kb.localId === boardId)?.board ?? "");

  const localBoardIndex = isLocalBoard
    ? localKanbans.findIndex((kb) => kb.localId === boardId)
    : -1;

  const localHasColumns = isLocalBoard
    ? Boolean(localKanbans[localBoardIndex]?.columns?.length)
    : false;

  const handleLocalBoardCreated = useCallback((localId) => {
    setSelectedBoardKey(`local__${localId}`);
  }, []);

  return (
    <div className={`main_container main_container--${theme}`}>
      <Sidebar
        selectedBoardKey={selectedBoardKey}
        setSelectedBoardKey={setSelectedBoardKey}
        setNewBoardModalIsOpen={setNewBoardModalIsOpen}
        userBoards={userBoards}
        localKanbans={localKanbans}
      />

      <div className="kanban_page_container">
        <Header
          boardName={selectedBoardName}
          hasColumns={isLocalBoard ? localHasColumns : hasColumns}
          isAdmin={isAdmin}
          isLocalBoard={isLocalBoard}
          setNewTaskModalIsOpen={setNewTaskModalIsOpen}
          setEditBoardModalIsOpen={setEditBoardModalIsOpen}
          setDeleteBoardModalIsOpen={setDeleteBoardModalIsOpen}
          setMembersModalIsOpen={setMembersModalIsOpen}
        />

        {/* Un seul KanbanBoard — API ou local selon isLocal */}
        {isApiBoard && boardId && (
          <KanbanBoard
            ref={kanbanBoardRef}
            boardId={Number(boardId)}
            isAdmin={isAdmin}
            setNewColumnModalIsOpen={setNewColumnModalIsOpen}
            setEditTaskModal={setEditTaskModal}
            setDeleteTaskModal={setDeleteTaskModal}
            setTaskDetailsModal={setTaskDetailsModal}
            onColumnsChange={handleColumnsChange}
          />
        )}

        {isLocalBoard && localBoardIndex >= 0 && (
          <KanbanBoard
            isLocal
            selectedKanban={localBoardIndex}
            isAdmin={true}
            setNewColumnModalIsOpen={setNewColumnModalIsOpen}
            setEditTaskModal={(v) =>
              setLocalEditTaskModal({ ...v, selectedKanban: localBoardIndex })
            }
            setDeleteTaskModal={(v) =>
              setLocalDeleteTaskModal({ ...v, selectedKanban: localBoardIndex })
            }
            setTaskDetailsModal={(v) =>
              setLocalTaskDetailsModal({
                ...v,
                selectedKanban: localBoardIndex,
              })
            }
            onColumnsChange={handleColumnsChange}
          />
        )}

        {!selectedBoardKey && (
          <div className="board_unless_column" style={{ margin: "auto" }}>
            <h3>Aucun board sélectionné.</h3>
          </div>
        )}
      </div>

      {/* ======= Modals API ======= */}
      {newBoardModalIsOpen && (
        <AddBoard
          setAddBoardModalIsOpen={setNewBoardModalIsOpen}
          setSelectedBoardId={(id) => setSelectedBoardKey(`api__${id}`)}
          onBoardCreated={handleLocalBoardCreated}
          canCreateApiBoard={Boolean(userBoards)}
          theme={theme}
        />
      )}
      {editBoardModalIsOpen && (
        <EditBoard
          setEditBoardModalIsOpen={setEditBoardModalIsOpen}
          boardId={isApiBoard ? Number(boardId) : undefined}
          selectedKanban={isLocalBoard ? localBoardIndex : undefined}
          onBoardRefresh={handleBoardRefresh}
          isLocal={isLocalBoard}
          theme={theme}
        />
      )}
      {deleteBoardModalIsOpen && (
        <DeleteBoard
          setDeleteBoardModalIsOpen={setDeleteBoardModalIsOpen}
          boardId={isApiBoard ? Number(boardId) : undefined}
          setSelectedBoardId={(id) =>
            id ? setSelectedBoardKey(`api__${id}`) : setSelectedBoardKey(null)
          }
          userBoards={userBoards}
          selectedKanban={isLocalBoard ? localBoardIndex : undefined}
          onDeleted={() => {
            const next = localKanbans.find((_, i) => i !== localBoardIndex);
            if (next) setSelectedBoardKey(`local__${next.localId}`);
            else if (userBoards?.[0])
              setSelectedBoardKey(`api__${userBoards[0].board.id}`);
            else setSelectedBoardKey(null);
          }}
          isLocal={isLocalBoard}
          theme={theme}
        />
      )}
      {newColumnModalIsOpen && (
        <AddColumn
          setNewColumnModalIsOpen={setNewColumnModalIsOpen}
          boardId={isApiBoard ? Number(boardId) : undefined}
          selectedKanban={isLocalBoard ? localBoardIndex : undefined}
          onBoardRefresh={handleBoardRefresh}
          isLocal={isLocalBoard}
          theme={theme}
        />
      )}
      {newTaskModalIsOpen && (
        <AddTask
          setNewTaskModalIsOpen={setNewTaskModalIsOpen}
          boardId={isApiBoard ? Number(boardId) : undefined}
          selectedKanban={isLocalBoard ? localBoardIndex : undefined}
          onBoardRefresh={handleBoardRefresh}
          isLocal={isLocalBoard}
          theme={theme}
        />
      )}

      {/* Modals tâches API */}
      {deleteTaskModal.open && (
        <DeleteTask
          setDeleteTaskModal={setDeleteTaskModal}
          deleteTaskModal={deleteTaskModal}
          boardId={Number(boardId)}
          onBoardRefresh={handleBoardRefresh}
        />
      )}
      {taskDetailsModal.open && (
        <TaskDetailsModal
          taskDetailsModal={taskDetailsModal}
          setTaskDetailsModal={setTaskDetailsModal}
          boardId={Number(boardId)}
          onBoardRefresh={handleBoardRefresh}
        />
      )}
      {editTaskModal.open && (
        <TaskEditor
          editTaskModal={editTaskModal}
          setEditTaskModal={setEditTaskModal}
          boardId={Number(boardId)}
          onBoardRefresh={handleBoardRefresh}
        />
      )}

      {/* Modals tâches locaux */}
      {localDeleteTaskModal.open && (
        <DeleteTask
          setDeleteTaskModal={setLocalDeleteTaskModal}
          deleteTaskModal={localDeleteTaskModal}
          isLocal
        />
      )}
      {localTaskDetailsModal.open && (
        <TaskDetailsModal
          taskDetailsModal={localTaskDetailsModal}
          setTaskDetailsModal={setLocalTaskDetailsModal}
          isLocal
        />
      )}
      {localEditTaskModal.open && (
        <TaskEditor
          editTaskModal={localEditTaskModal}
          setEditTaskModal={setLocalEditTaskModal}
          isLocal
        />
      )}

      {/* Modal membres (API uniquement) */}
      {membersModalIsOpen && isApiBoard && (
        <MembersModal
          setMembersModalIsOpen={setMembersModalIsOpen}
          boardId={Number(boardId)}
          currentUserId={user?.user?.id}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};

export default Kanban;
