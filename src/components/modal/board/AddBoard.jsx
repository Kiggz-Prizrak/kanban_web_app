import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { createBoard } from "../../../api/boards";
import CloseIcon from "../../../assets/icons/CloseIcon";

const AddBoard = ({ setAddBoardModalIsOpen, setSelectedBoardId, theme }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    setServerError("");
    setIsLoading(true);

    try {
      const columnNames = columns.map((c) => c.name.trim()).filter(Boolean);

      const result = await createBoard({
        title: data.title,
        columns: columnNames,
      });

      // Le back retourne { message, board: boardObject, boardId: number }
      setSelectedBoardId(result.boardId);
      setAddBoardModalIsOpen(false);

      // Recharge le loader pour mettre à jour la sidebar
      navigate(0);
    } catch (err) {
      setServerError(err.message || "Erreur lors de la création du board");
    } finally {
      setIsLoading(false);
    }
  };

  const addColumn = (e) => {
    e.preventDefault();
    setColumns((prev) => [...prev, { name: "" }]);
  };

  const removeColumn = (index) => {
    setColumns((prev) => prev.filter((_, i) => i !== index));
  };

  const setColumnName = (e, index) => {
    const updated = [...columns];
    updated[index] = { name: e.target.value };
    setColumns(updated);
  };

  return (
    <div className="modal_background">
      <div className={`modal_container modal_container--${theme}`}>
        <form className="modal_form" onSubmit={handleSubmit(onSubmit)}>
          <div className={`form_title form_title--${theme}`}>
            <h2>Add New Board</h2>
            <button type="button" onClick={() => setAddBoardModalIsOpen(false)}>
              <CloseIcon />
            </button>
          </div>

          <label htmlFor="title">Board Name</label>
          <input
            id="title"
            type="text"
            placeholder="Ex: Marketing"
            className={
              errors.title
                ? "errorInput"
                : `form_input_text form_input_text--${theme}`
            }
            {...register("title", { required: "Le nom du board est requis." })}
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
                  placeholder="Ex: Todo"
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
            onClick={addColumn}
          >
            + Add New Column
          </button>

          <button
            type="submit"
            className="form_button_submit"
            disabled={isLoading}
          >
            {isLoading ? "Création..." : "Create New Board"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBoard;
