import { useState } from "react";
import { useForm } from "react-hook-form";

import { addColumn } from "../../../api/boards";
import CloseIcon from "../../../assets/icons/CloseIcon";

const AddColumn = ({
  setNewColumnModalIsOpen,
  boardId,
  onBoardRefresh,
  theme,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    setServerError("");
    setIsLoading(true);

    try {
      await addColumn(boardId, { name: data.name.trim() });
      setNewColumnModalIsOpen(false);
      onBoardRefresh?.();
    } catch (err) {
      setServerError(err.message || "Erreur lors de la création de la colonne");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal_background">
      <div className={`modal_container modal_container--${theme}`}>
        <form className="modal_form" onSubmit={handleSubmit(onSubmit)}>
          <div className={`form_title form_title--${theme}`}>
            <h2>Add New Column</h2>
            <button
              type="button"
              onClick={() => setNewColumnModalIsOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>

          <label htmlFor="name">Column Name</label>
          <input
            id="name"
            type="text"
            placeholder="Ex: In Review"
            className={
              errors.name
                ? "errorInput"
                : `form_input_text form_input_text--${theme}`
            }
            {...register("name", {
              required: "Le nom de la colonne est requis.",
            })}
          />
          {errors.name && <p className="errorMessage">{errors.name.message}</p>}
          {serverError && <p className="errorMessage">{serverError}</p>}

          <button
            type="submit"
            className="form_button_submit"
            disabled={isLoading}
          >
            {isLoading ? "Création..." : "Create New Column"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddColumn;
