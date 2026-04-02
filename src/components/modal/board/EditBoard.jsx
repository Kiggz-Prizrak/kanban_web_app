import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  getBoardById,
  addColumn,
  deleteColumn,
  updateColumn,
} from "../../../api/boards";
import CloseIcon from "../../../assets/icons/CloseIcon";

const EditBoard = ({ setEditBoardModalIsOpen, boardId, theme }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  // columnsToDelete = ids des colonnes existantes à supprimer
  const [columnsToDelete, setColumnsToDelete] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Charge le board pour pré-remplir le formulaire
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getBoardById(boardId);
        setBoard(data);
        setValue("title", data.name);
        // On marque les colonnes existantes avec leur id
        setColumns(
          data.columns.map((c) => ({ id: c.id, name: c.name, isNew: false })),
        );
      } catch (err) {
        setServerError("Impossible de charger le board");
      }
    };
    load();
  }, [boardId, setValue]);

  const onSubmit = async (data) => {
    setServerError("");
    setIsLoading(true);

    try {
      // 1. Supprimer les colonnes marquées
      await Promise.all(
        columnsToDelete.map((colId) => deleteColumn(boardId, colId)),
      );

      // 2. Mettre à jour les colonnes existantes (nom modifié)
      const existingCols = columns.filter((c) => !c.isNew);
      await Promise.all(
        existingCols.map((col) =>
          updateColumn(boardId, col.id, { name: col.name }),
        ),
      );

      // 3. Créer les nouvelles colonnes
      const newCols = columns.filter((c) => c.isNew && c.name.trim());
      for (const col of newCols) {
        await addColumn(boardId, { name: col.name.trim() });
      }

      setEditBoardModalIsOpen(false);
      // Le KanbanBoard se rechargera via onBoardRefresh depuis le parent
      // Pour le titre dans la sidebar on recharge la page
      if (data.title !== board?.name) {
        window.location.reload();
      }
    } catch (err) {
      setServerError(err.message || "Erreur lors de la modification");
    } finally {
      setIsLoading(false);
    }
  };

  const addNewColumn = (e) => {
    e.preventDefault();
    setColumns((prev) => [...prev, { id: null, name: "", isNew: true }]);
  };

  const removeColumn = (index) => {
    const col = columns[index];
    // Si la colonne existe en base, on la marque pour suppression
    if (col.id && !col.isNew) {
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
              <div key={i} className="sub_element_btn">
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
