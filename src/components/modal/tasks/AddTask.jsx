import { useState } from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { getBoardById, addTask } from "../../../api/boards";
import CloseIcon from "../../../assets/icons/CloseIcon";
import ArrowIcon from "../../../assets/icons/ArrowIcon";

const AddTask = ({ setNewTaskModalIsOpen, boardId, onBoardRefresh, theme }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [columns, setColumns] = useState([]);
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Charge les colonnes du board pour le sélecteur de statut
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getBoardById(boardId);
        setColumns(data.columns);
        setSelectedColumnId(data.columns[0]?.id ?? null);
      } catch {
        setServerError("Impossible de charger les colonnes");
      }
    };
    load();
  }, [boardId]);

  const onSubmit = async (data) => {
    setServerError("");
    setIsLoading(true);

    try {
      const subtaskTitles = subtasks.map((s) => s.title.trim()).filter(Boolean);

      await addTask(boardId, selectedColumnId, {
        title: data.title.trim(),
        description: data.description.trim(),
        subtasks: subtaskTitles,
      });

      setNewTaskModalIsOpen(false);
      onBoardRefresh?.();
    } catch (err) {
      setServerError(err.message || "Erreur lors de la création de la tâche");
    } finally {
      setIsLoading(false);
    }
  };

  const addSubtask = (e) => {
    e.preventDefault();
    setSubtasks((prev) => [...prev, { title: "" }]);
  };

  const removeSubtask = (index) => {
    setSubtasks((prev) => prev.filter((_, i) => i !== index));
  };

  const setSubtaskTitle = (e, index) => {
    const updated = [...subtasks];
    updated[index] = { title: e.target.value };
    setSubtasks(updated);
  };

  const selectedColumn = columns.find((c) => c.id === selectedColumnId);

  return (
    <div className="modal_background">
      <div className={`modal_container modal_container--${theme}`}>
        <form className="modal_form" onSubmit={handleSubmit(onSubmit)}>
          <div className={`form_title form_title--${theme}`}>
            <h2>Add New Task</h2>
            <button type="button" onClick={() => setNewTaskModalIsOpen(false)}>
              <CloseIcon />
            </button>
          </div>

          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Ex: Design new landing page"
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
          <input
            id="description"
            type="text"
            placeholder="Ex: Create wireframes and mockups"
            className={
              errors.description
                ? "errorInput"
                : `form_input_text form_input_text--${theme}`
            }
            {...register("description", {
              required: "La description est requise.",
            })}
          />
          {errors.description && (
            <p className="errorMessage">{errors.description.message}</p>
          )}

          {subtasks.length > 0 && <label>Subtasks</label>}
          <div className="modal_form_subs">
            {subtasks.map((sub, i) => (
              <div key={i} className="sub_element_btn">
                <input
                  className={`form_input_text form_input_text--${theme}`}
                  type="text"
                  placeholder="Ex: Create wireframe"
                  value={sub.title}
                  onChange={(e) => setSubtaskTitle(e, i)}
                />
                <button type="button" onClick={() => removeSubtask(i)}>
                  <CloseIcon />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className={`form_secondary_button form_secondary_button--${theme}`}
            onClick={addSubtask}
          >
            + Add New Subtask
          </button>

          <label>Status</label>
          <div className="form_dropdown">
            <div
              className={`form_dropdown_title form_dropdown_title--${theme}`}
            >
              <h4>{selectedColumn?.name ?? "—"}</h4>
              <button
                type="button"
                className={dropdownIsOpen ? "form_dropdown_button_active" : ""}
                onClick={() => setDropdownIsOpen((v) => !v)}
              >
                <ArrowIcon />
              </button>
            </div>
            {dropdownIsOpen && (
              <ul className="form_dropdown_list">
                {columns
                  .filter((c) => c.id !== selectedColumnId)
                  .map((col) => (
                    <li key={col.id}>
                      <button
                        type="button"
                        className="form_button_submit"
                        onClick={() => {
                          setSelectedColumnId(col.id);
                          setDropdownIsOpen(false);
                        }}
                      >
                        {col.name}
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {serverError && <p className="errorMessage">{serverError}</p>}

          <button
            type="submit"
            className="form_button_submit"
            disabled={isLoading || !selectedColumnId}
          >
            {isLoading ? "Création..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
