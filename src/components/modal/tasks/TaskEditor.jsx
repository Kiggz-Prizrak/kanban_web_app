import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { getBoardById, updateTask } from "../../../api/boards";
import CloseIcon from "../../../assets/icons/CloseIcon";

const TaskEditor = ({
  editTaskModal,
  setEditTaskModal,
  boardId,
  onBoardRefresh,
}) => {
  const theme = useSelector((state) => state.theme.currentTheme);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [task, setTask] = useState(null);
  const [subtasks, setSubtasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  const close = () =>
    setEditTaskModal({ open: false, taskId: null, columnId: null });

  useEffect(() => {
    const load = async () => {
      try {
        const board = await getBoardById(boardId);
        const col = board.columns.find((c) => c.id === editTaskModal.columnId);
        const found = col?.tasks.find((t) => t.id === editTaskModal.taskId);
        if (found) {
          setTask(found);
          setValue("title", found.title);
          setValue("description", found.description);
          setSubtasks(found.substasks?.map((s) => ({ ...s })) ?? []);
        }
      } catch {
        setServerError("Impossible de charger la tâche");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [boardId, editTaskModal.taskId, editTaskModal.columnId, setValue]);

  const onSubmit = async (data) => {
    setServerError("");
    setIsSaving(true);

    try {
      await updateTask(boardId, editTaskModal.columnId, editTaskModal.taskId, {
        title: data.title.trim(),
        description: data.description.trim(),
        subtasks: subtasks
          .filter((s) => s.title?.trim())
          .map((s) => ({
            id: s.id ?? undefined,
            title: s.title.trim(),
            isCompleted: s.isCompleted ?? false,
          })),
      });

      close();
      onBoardRefresh?.();
    } catch (err) {
      setServerError(err.message || "Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const addSubtask = (e) => {
    e.preventDefault();
    setSubtasks((prev) => [
      ...prev,
      { id: null, title: "", isCompleted: false },
    ]);
  };

  const removeSubtask = (index) => {
    setSubtasks((prev) => prev.filter((_, i) => i !== index));
  };

  const setSubtaskTitle = (e, index) => {
    const updated = [...subtasks];
    updated[index] = { ...updated[index], title: e.target.value };
    setSubtasks(updated);
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

  return (
    <div className="modal_background">
      <div className={`modal_container modal_container--${theme}`}>
        <form className="modal_form" onSubmit={handleSubmit(onSubmit)}>
          <div className={`form_title form_title--${theme}`}>
            <h2>Edit Task</h2>
            <button type="button" onClick={close}>
              <CloseIcon />
            </button>
          </div>

          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            className={
              errors.title
                ? "errorInput"
                : `form_input_text form_input_text--${theme}`
            }
            {...register("title", { required: "Le titre est requis." })}
          />
          {errors.title && (
            <p className="errorMessage">{errors.title.message}</p>
          )}

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className="form_input_text_description"
            {...register("description")}
          />

          <label>Subtasks</label>
          <div className="modal_form_subs">
            {subtasks.map((sub, i) => (
              <div key={i} className="sub_element_btn">
                <input
                  className={`form_input_text form_input_text--${theme}`}
                  type="text"
                  value={sub.title}
                  onChange={(e) => setSubtaskTitle(e, i)}
                />
                <button type="button" onClick={() => removeSubtask(i)}>
                  <CloseIcon />
                </button>
              </div>
            ))}
            <button
              type="button"
              className={`form_secondary_button form_secondary_button--${theme}`}
              onClick={addSubtask}
            >
              + Add New Subtask
            </button>
          </div>

          {serverError && <p className="errorMessage">{serverError}</p>}

          <button
            type="submit"
            className="form_button_submit"
            disabled={isSaving}
          >
            {isSaving ? "Sauvegarde..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskEditor;
