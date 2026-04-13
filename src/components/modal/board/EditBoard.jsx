import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import {
  getBoardById,
  addColumn,
  deleteColumn,
  updateColumn,
} from "../../../api/boards";
import { editBoard, generateLocalId } from "../../../store/localKanbanSlice";
import CloseIcon from "../../../assets/icons/CloseIcon";

const EditBoard = ({
  setEditBoardModalIsOpen,
  // API props
  boardId,
  onBoardRefresh,
  // Local props
  selectedKanban,
  isLocal = false,
  theme,
}) => {
  const dispatch = useDispatch();
  const localKanban = useSelector((state) =>
    isLocal ? state.localKanban.kanbans[selectedKanban] : null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [columnsToDelete, setColumnsToDelete] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (isLocal) {
      setValue("title", localKanban?.board ?? "");
      setColumns(
        localKanban?.columns.map((c) => ({ ...c, isNew: false })) ?? [],
      );
    } else {
      const load = async () => {
        try {
          const data = await getBoardById(boardId);
          setBoard(data);
          setValue("title", data.name);
          setColumns(
            data.columns.map((c) => ({ id: c.id, name: c.name, isNew: false })),
          );
        } catch {
          setServerError("Impossible de charger le board");
        }
      };
      load();
    }
  }, [boardId, isLocal, localKanban, setValue]);

  const onSubmit = async (data) => {
    setServerError("");
    setIsLoading(true);

    try {
      if (isLocal) {
        dispatch(
          editBoard({
            selectedKanban,
            newBoard: {
              ...localKanban,
              board: data.title.trim() || localKanban.board,
              columns: columns
                .filter((c) => c.name.trim())
                .map((c) => ({
                  ...c,
                  id: c.id ?? generateLocalId(),
                  tasks: c.tasks ?? [],
                })),
            },
          }),
        );
        setEditBoardModalIsOpen(false);
      } else {
        await Promise.all(
          columnsToDelete.map((colId) => deleteColumn(boardId, colId)),
        );
        await Promise.all(
          columns
            .filter((c) => !c.isNew)
            .map((col) => updateColumn(boardId, col.id, { name: col.name })),
        );
        for (const col of columns.filter((c) => c.isNew && c.name.trim())) {
          await addColumn(boardId, { name: col.name.trim() });
        }
        setEditBoardModalIsOpen(false);
        if (data.title !== board?.name) window.location.reload();
        else onBoardRefresh?.();
      }
    } catch (err) {
      setServerError(err.message || "Erreur lors de la modification");
    } finally {
      setIsLoading(false);
    }
  };

  const addNewColumn = (e) => {
    e.preventDefault();
    setColumns((prev) => [
      ...prev,
      { id: null, name: "", isNew: true, tasks: [] },
    ]);
  };

  const removeColumn = (index) => {
    const col = columns[index];
    if (!isLocal && col.id && !col.isNew) {
      setColumnsToDelete((prev) => [...prev, col.id]);
    }
    setColumns((prev) => prev.filter((_, i) => i !== index));
  };

  const setColumnName = (e, index) => {
    const updated = [...columns];
    updated[index] = { ...updated[index], name: e.target.value };
    setColumns(updated);
  };

  return (
    <div className="modal_background">
      <div className={`modal_container modal_container--${theme}`}>
        <form className="modal_form" onSubmit={handleSubmit(onSubmit)}>
          <div className={`form_title form_title--${theme}`}>
            <h2>Edit Board</h2>
            <button
              type="button"
              onClick={() => setEditBoardModalIsOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>

          <label htmlFor="title">Board Name</label>
          <input
            id="title"
            type="text"
            className={
              errors.title
                ? "errorInput"
                : `form_input_text form_input_text--${theme}`
            }
            {...register("title", { required: "Le nom est requis." })}
          />
          {errors.title && (
            <p className="errorMessage">{errors.title.message}</p>
          )}

          {columns.length > 0 && <label>Board Columns</label>}
          <div className="modal_form_subs">
            {columns.map((col, i) => (
              <div key={col.id ?? i} className="sub_element_btn">
                <input
                  className={`form_input_text form_input_text--${theme}`}
                  type="text"
                  value={col.name}
                  onChange={(e) => setColumnName(e, i)}
                />
                <button type="button" onClick={() => removeColumn(i)}>
                  <CloseIcon />
                </button>
              </div>
            ))}
          </div>

          {serverError && <p className="errorMessage">{serverError}</p>}

          <button
            type="button"
            className={`form_secondary_button form_secondary_button--${theme}`}
            onClick={addNewColumn}
          >
            + Add New Column
          </button>
          <button
            type="submit"
            className="form_button_submit"
            disabled={isLoading}
          >
            {isLoading ? "Sauvegarde..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBoard;
