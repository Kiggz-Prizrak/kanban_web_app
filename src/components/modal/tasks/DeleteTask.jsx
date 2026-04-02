import { useState } from "react";
import { useSelector } from "react-redux";

import { deleteTask } from "../../../api/boards";

const DeleteTask = ({
  setDeleteTaskModal,
  deleteTaskModal,
  boardId,
  onBoardRefresh,
}) => {
  const theme = useSelector((state) => state.theme.currentTheme);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleDelete = async () => {
    setIsLoading(true);
    setServerError("");

    try {
      await deleteTask(
        boardId,
        deleteTaskModal.columnId,
        deleteTaskModal.taskId,
      );
      setDeleteTaskModal({ open: false, taskId: null, columnId: null });
      onBoardRefresh?.();
    } catch (err) {
      setServerError(err.message || "Erreur lors de la suppression");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal_background">
      <div className={`modal_container modal_container--${theme}`}>
        <div className="modal_content">
          <h2 className="modal_delete_title">Delete This Task?</h2>
          <p>
            Are you sure you want to delete this task and its subtasks? This
            action cannot be reversed.
          </p>

          {serverError && <p className="errorMessage">{serverError}</p>}

          <div className="modal_delete_btn_section">
            <button
              className="form_delete_button"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Suppression..." : "Delete"}
            </button>
            <button
              className={`form_secondary_button form_secondary_button--${theme}`}
              onClick={() =>
                setDeleteTaskModal({
                  open: false,
                  taskId: null,
                  columnId: null,
                })
              }
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteTask;
