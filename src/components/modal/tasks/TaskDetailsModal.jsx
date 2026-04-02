import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { getBoardById, updateTask } from "../../../api/boards";
import CloseIcon from "../../../assets/icons/CloseIcon";

const TaskDetailsModal = ({
  taskDetailsModal,
  setTaskDetailsModal,
  boardId,
  onBoardRefresh,
}) => {
  const theme = useSelector((state) => state.theme.currentTheme);

  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  const close = () =>
    setTaskDetailsModal({ open: false, taskId: null, columnId: null });

  // Charge la tâche depuis le board
  useEffect(() => {
    const load = async () => {
      try {
        const board = await getBoardById(boardId);
        const col = board.columns.find(
          (c) => c.id === taskDetailsModal.columnId,
        );
        const found = col?.tasks.find((t) => t.id === taskDetailsModal.taskId);
        setTask(found ?? null);
      } catch {
        setServerError("Impossible de charger la tâche");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [boardId, taskDetailsModal.taskId, taskDetailsModal.columnId]);

  // Toggle une sous-tâche et sauvegarde immédiatement
  const handleSubtaskToggle = async (subtaskId, currentValue) => {
    if (!task) return;

    // Mise à jour optimiste locale
    const updatedSubtasks = task.substasks.map((s) =>
      s.id === subtaskId ? { ...s, isCompleted: !currentValue } : s,
    );
    setTask((prev) => ({ ...prev, substasks: updatedSubtasks }));

    setIsSaving(true);
    try {
      await updateTask(boardId, taskDetailsModal.columnId, task.id, {
        subtasks: updatedSubtasks.map((s) => ({
          id: s.id,
          title: s.title,
          isCompleted: s.isCompleted,
        })),
      });
      onBoardRefresh?.();
    } catch (err) {
      setServerError(err.message || "Erreur lors de la mise à jour");
      // Rollback
      setTask((prev) => ({
        ...prev,
        substasks: task.substasks,
      }));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="modal_background">
        <div className={`modal_container modal_container--${theme}`}>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!task) return null;

  const completedCount =
    task.substasks?.filter((s) => s.isCompleted).length ?? 0;
  const totalCount = task.substasks?.length ?? 0;

  return (
    <div className="modal_background">
      <div className={`modal_container modal_container--${theme}`}>
        <div className="modal_content">
          <div className="form_title">
            <h2>{task.title}</h2>
            <button type="button" onClick={close}>
              <CloseIcon />
            </button>
          </div>

          <p>{task.description}</p>

          {totalCount > 0 && (
            <>
              <label>
                Subtasks ({completedCount} of {totalCount})
              </label>
              <ul>
                {task.substasks.map((subtask) => (
                  <li
                    key={subtask.id}
                    className={`checkbox_field_container checkbox_field_container--${theme}`}
                  >
                    <input
                      type="checkbox"
                      checked={subtask.isCompleted}
                      disabled={isSaving}
                      onChange={() =>
                        handleSubtaskToggle(subtask.id, subtask.isCompleted)
                      }
                    />
                    <p
                      className={
                        subtask.isCompleted
                          ? "substaskNameChecked"
                          : "substaskName"
                      }
                    >
                      {subtask.title}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}

          {serverError && <p className="errorMessage">{serverError}</p>}

          <button className="form_button_submit" onClick={close}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
