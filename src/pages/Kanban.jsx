import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import KanbanBoard from "../components/KanbanBoard";
import { useSelector } from "react-redux";
import { useState } from "react";

import AddBoard from "../components/modal/board/AddBoard";
import AddColumn from "../components/modal/columns/AddColums";
import AddTask from "../components/modal/tasks/AddTask";
import DeleteTask from "../components/modal/tasks/DeleteTask";
import TaskEditor from "../components/modal/tasks/TaskEditor";
import EditBoard from "../components/modal/board/EditBoard";
import TaskDetailsModal from "../components/modal/Tasks/TaskDetailsModal";
import DeleteBoard from "../components/modal/board/DeleteBoard";

// import datas from "/public/mock/data";

const Kanban = () => {
  const [selectedKanban, setSelectedKanban] = useState(0);
  const [newBoardModalIsOpen, setNewBoardModalIsOpen] = useState(false);
  const [editBoardModalIsOpen, setEditBoardModalIsOpen] = useState(false);
  const [deleteBoardModalIsOpen, setDeleteBoardModalIsOpen] = useState(false);

  const [newColumnModalIsOpen, setNewColumnModalIsOpen] = useState(false);

  const [newTaskModalIsOpen, setNewTaskModalIsOpen] = useState(false);
  const [editTaskModalIsOpen, setEditTaskModalIsOpen] = useState({
    columnIndex: "",
    id: "",
    selectedKanban,
    open: false,
  });
  const [deleteTaskModalIsOpen, setDeleteTaskModalIsOpen] = useState({
    columnIndex: "",
    id: "",
    selectedKanban,
    open: false,
  });
  const [taskDetailsModalIsOpen, setTaskDetailsModalIsOpen] = useState({
    columnIndex: "",
    id: "",
    selectedKanban,
    open: false,
  });

  const kanbansList = useSelector((state) => state.kanbans);
  const theme = useSelector((state) => state.theme.currentTheme);

  // console.log(kanbansList[selectedKanban]);
  // console.log(editTaskModalIsOpen);

  return (
    <div className={`main_container main_container--${theme}`}>
      <Sidebar
        selectedKanban={selectedKanban}
        setNewBoardModalIsOpen={setNewBoardModalIsOpen}
        setSelectedKanban={setSelectedKanban}
        kanbansList={kanbansList}
      />
      <div className="kanban_page_container">
        <Header
          selectedKanban={selectedKanban}
          kanbanTitle={kanbansList[selectedKanban]?.board}
          setNewTaskModalIsOpen={setNewTaskModalIsOpen}
          setEditBoardModalIsOpen={setEditBoardModalIsOpen}
          setDeleteBoardModalIsOpen={setDeleteBoardModalIsOpen}
        />
        {kanbansList.length ? (
          <KanbanBoard
            setNewColumnModalIsOpen={setNewColumnModalIsOpen}
            newColumnModalIsOpen={newColumnModalIsOpen}
            selectedKanban={selectedKanban}
            setEditTaskModalIsOpen={setEditTaskModalIsOpen}
            setDeleteTaskModalIsOpen={setDeleteTaskModalIsOpen}
            setTaskDetailsModalIsOpen={setTaskDetailsModalIsOpen}
          />
        ) : (
          ""
        )}
      </div>

      {/* ======= modal section ======= */}

      {newBoardModalIsOpen ? (
        <AddBoard
          setAddBoardModalIsOpen={setNewBoardModalIsOpen}
          theme={theme}
        />
      ) : (
        ""
      )}

      {editBoardModalIsOpen ? (
        <EditBoard
          setEditBoardModalIsOpen={setEditBoardModalIsOpen}
          selectedKanban={selectedKanban}
          theme={theme}
        />
      ) : (
        ""
      )}
      {deleteBoardModalIsOpen ? (
        <DeleteBoard
          setDeleteBoardModalIsOpen={setDeleteBoardModalIsOpen}
          selectedKanban={selectedKanban}
          setSelectedKanban={setSelectedKanban}
          theme={theme}
        />
      ) : (
        ""
      )}

      {newColumnModalIsOpen ? (
        <AddColumn
          setNewColumnModalIsOpen={setNewColumnModalIsOpen}
          selectedKanban={selectedKanban}
          theme={theme}
        />
      ) : (
        ""
      )}
      {newTaskModalIsOpen ? (
        <AddTask
          setNewTaskModalIsOpen={setNewTaskModalIsOpen}
          selectedKanban={selectedKanban}
          theme={theme}
        />
      ) : (
        ""
      )}
      {deleteTaskModalIsOpen.open ? (
        <DeleteTask
          setDeleteTaskModalIsOpen={setDeleteTaskModalIsOpen}
          deleteTaskModalIsOpen={deleteTaskModalIsOpen}
          theme={theme}
        />
      ) : (
        ""
      )}
      {taskDetailsModalIsOpen.open ? (
        <TaskDetailsModal
          selectedKanban={selectedKanban}
          taskDatas={taskDetailsModalIsOpen}
          setTaskDetailsModalIsOpen={setTaskDetailsModalIsOpen}
          theme={theme}
        />
      ) : (
        ""
      )}
      {editTaskModalIsOpen.open ? (
        <TaskEditor
          selectedKanban={selectedKanban}
          taskDatas={editTaskModalIsOpen}
          setEditTaskModalIsOpen={setEditTaskModalIsOpen}
          theme={theme}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Kanban;
