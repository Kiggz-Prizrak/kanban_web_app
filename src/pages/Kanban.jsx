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

const Kanban = () => {
  const userBoards = useLoaderData();
  const theme = useSelector((state) => state.theme.currentTheme);
  const { user } = useAuth();

  const kanbanBoardRef = useRef(null);

  // hasColumns est mis à jour par KanbanBoard après chaque fetch
  const [hasColumns, setHasColumns] = useState(false);

  const handleBoardRefresh = useCallback(async () => {
    await kanbanBoardRef.current?.fetchBoard();
    // Après le refresh, on relit hasColumns depuis la ref
    setHasColumns(kanbanBoardRef.current?.hasColumns ?? false);
  }, []);

  // Callback passé à KanbanBoard pour qu'il notifie Kanban quand les colonnes changent
  const handleColumnsChange = useCallback((count) => {
    setHasColumns(count > 0);
  }, []);

  const [selectedBoardId, setSelectedBoardId] = useState(
    userBoards?.[0]?.board?.id ?? null,
  );

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

  const currentMembership = userBoards?.find(
    (ub) => ub.board?.id === selectedBoardId,
  );
  const isAdmin = currentMembership?.role === "admin";
  const selectedBoardName = currentMembership?.board?.name ?? "";

  return (
    <div className={`main_container main_container--${theme}`}>
      <Sidebar
        selectedBoardId={selectedBoardId}
        setSelectedBoardId={setSelectedBoardId}
        setNewBoardModalIsOpen={setNewBoardModalIsOpen}
        userBoards={userBoards}
      />

      <div className="kanban_page_container">
        <Header
          boardName={selectedBoardName}
          hasColumns={hasColumns}
          isAdmin={isAdmin}
          setNewTaskModalIsOpen={setNewTaskModalIsOpen}
          setEditBoardModalIsOpen={setEditBoardModalIsOpen}
          setDeleteBoardModalIsOpen={setDeleteBoardModalIsOpen}
          setMembersModalIsOpen={setMembersModalIsOpen}
        />

        {selectedBoardId && (
          <KanbanBoard
            ref={kanbanBoardRef}
            boardId={selectedBoardId}
            isAdmin={isAdmin}
            setNewColumnModalIsOpen={setNewColumnModalIsOpen}
            setEditTaskModal={setEditTaskModal}
            setDeleteTaskModal={setDeleteTaskModal}
            setTaskDetailsModal={setTaskDetailsModal}
            onColumnsChange={handleColumnsChange}
          />
        )}
      </div>

      {/* ======= Modals ======= */}

      {newBoardModalIsOpen && (
        <AddBoard
          setAddBoardModalIsOpen={setNewBoardModalIsOpen}
          setSelectedBoardId={setSelectedBoardId}
          theme={theme}
        />
      )}

      {editBoardModalIsOpen && selectedBoardId && (
        <EditBoard
          setEditBoardModalIsOpen={setEditBoardModalIsOpen}
          boardId={selectedBoardId}
          onBoardRefresh={handleBoardRefresh}
          theme={theme}
        />
      )}

      {deleteBoardModalIsOpen && selectedBoardId && (
        <DeleteBoard
          setDeleteBoardModalIsOpen={setDeleteBoardModalIsOpen}
          boardId={selectedBoardId}
          setSelectedBoardId={setSelectedBoardId}
          userBoards={userBoards}
          theme={theme}
        />
      )}

      {newColumnModalIsOpen && selectedBoardId && (
        <AddColumn
          setNewColumnModalIsOpen={setNewColumnModalIsOpen}
          boardId={selectedBoardId}
          onBoardRefresh={handleBoardRefresh}
          theme={theme}
        />
      )}

      {newTaskModalIsOpen && selectedBoardId && (
        <AddTask
          setNewTaskModalIsOpen={setNewTaskModalIsOpen}
          boardId={selectedBoardId}
          onBoardRefresh={handleBoardRefresh}
          theme={theme}
        />
      )}

      {deleteTaskModal.open && (
        <DeleteTask
          setDeleteTaskModal={setDeleteTaskModal}
          deleteTaskModal={deleteTaskModal}
          boardId={selectedBoardId}
          onBoardRefresh={handleBoardRefresh}
        />
      )}

      {taskDetailsModal.open && (
        <TaskDetailsModal
          taskDetailsModal={taskDetailsModal}
          setTaskDetailsModal={setTaskDetailsModal}
          boardId={selectedBoardId}
          onBoardRefresh={handleBoardRefresh}
        />
      )}

      {editTaskModal.open && (
        <TaskEditor
          editTaskModal={editTaskModal}
          setEditTaskModal={setEditTaskModal}
          boardId={selectedBoardId}
          onBoardRefresh={handleBoardRefresh}
        />
      )}

      {membersModalIsOpen && selectedBoardId && (
        <MembersModal
          setMembersModalIsOpen={setMembersModalIsOpen}
          boardId={selectedBoardId}
          currentUserId={user?.user?.id}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};

export default Kanban;
