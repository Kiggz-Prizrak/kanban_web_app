import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { getBoardById, addTask as addTaskApi } from "../../../api/boards";
import { addNewTask, generateLocalId } from "../../../store/localKanbanSlice";
import CloseIcon from "../../../assets/icons/CloseIcon";
import ArrowIcon from "../../../assets/icons/ArrowIcon";

const AddTask = ({
  setNewTaskModalIsOpen,
  // API props
  boardId,
  onBoardRefresh,
  // Local props
  selectedKanban,
  isLocal = false,
  theme,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const localKanban = useSelector((state) =>
    isLocal ? state.localKanban.kanbans[selectedKanban] : null,
  );

  // Colonnes — API : chargées depuis le serveur / Local : depuis Redux
  const [columns, setColumns] = useState([]);
  const [selectedColumnId, setSelectedColumnId] = useState(null); // API
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(0); // Local
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (isLocal) {
      setColumns(localKanban?.columns ?? []);
    } else {
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
    }
  }, [boardId, isLocal, localKanban]);

  const onSubmit = async (data) => {
    setServerError("");
    setIsLoading(true);

    try {
      if (isLocal) {
        dispatch(
          addNewTask({
            selectedKanban,
            column: selectedColumnIndex,
            newTask: {
              id: generateLocalId(),
              title: data.title.trim(),
              description: data.description.trim(),
              status: columns[selectedColumnIndex]?.name ?? "",
              subtasks: subtasks
                .filter((s) => s.name.trim())
                .map((s) => ({ ...s, id: s.id ?? generateLocalId() })),
            },
          }),
        );
        setNewTaskModalIsOpen(false);
      } else {
        await addTaskApi(boardId, selectedColumnId, {
          title: data.title.trim(),
          description: data.description.trim(),
          subtasks: subtasks.map((s) => s.title.trim()).filter(Boolean),
        });
        setNewTaskModalIsOpen(false);
        onBoardRefresh?.();
      }
    } catch (err) {
      setServerError(err.message || "Erreur lors de la création de la tâche");
    } finally {
      setIsLoading(false);
    }
  };

  const addSubtask = (e) => {
    e.preventDefault();
    if (isLocal) {
      setSubtasks((prev) => [
        ...prev,
        { name: "", id: generateLocalId(), isChecked: false },
      ]);
    } else {
      setSubtasks((prev) => [...prev, { title: "" }]);
    }
  };

  const removeSubtask = (index) =>
    setSubtasks((prev) => prev.filter((_, i) => i !== index));

  const setSubtaskValue = (e, index) => {
    const updated = [...subtasks];
    updated[index] = isLocal
      ? { ...updated[index], name: e.target.value }
      : { title: e.target.value };
    setSubtasks(updated);
  };

  const selectedColumn = isLocal
    ? columns[selectedColumnIndex]
    : columns.find((c) => c.id === selectedColumnId);

  const otherColumns = isLocal
    ? columns.filter((_, i) => i !== selectedColumnIndex)
    : columns.filter((c) => c.id !== selectedColumnId);

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
                  value={isLocal ? sub.name : sub.title}
                  onChange={(e) => setSubtaskValue(e, i)}
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
                {otherColumns.map((col, i) => (
                  <li key={col.id ?? i}>
                    <button
                      type="button"
                      className="form_button_submit"
                      onClick={() => {
                        if (isLocal)
                          setSelectedColumnIndex(columns.indexOf(col));
                        else setSelectedColumnId(col.id);
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
            disabled={isLoading || (!isLocal && !selectedColumnId)}
          >
            {isLoading ? "Création..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
