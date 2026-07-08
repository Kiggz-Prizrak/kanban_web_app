import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { createBoard } from "../../../api/boards";
import { addNewBoard, generateLocalId } from "../../../store/localKanbanSlice";
import CloseIcon from "../../../assets/icons/CloseIcon";

const AddBoard = ({
  setAddBoardModalIsOpen,
  setSelectedBoardId, // API : appelé avec boardId numérique
  onBoardCreated, // Local : appelé avec localId string
  canCreateApiBoard = true, // false si non connecté — force le mode local
  theme,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLocal, setIsLocal] = useState(!canCreateApiBoard);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    setServerError("");
    setIsLoading(true);

    try {
      if (isLocal) {
        const localId = generateLocalId();
        const newColumns = columns
          .filter((c) => c.name.trim())
          .map((c, i) => ({
            name: c.name.trim(),
            id: generateLocalId(),
            position: i,
            tasks: [],
          }));
        dispatch(
          addNewBoard({
            localId,
            board: data.title.trim(),
            columns: newColumns,
          }),
        );
        setAddBoardModalIsOpen(false);
        onBoardCreated?.(localId);
      } else {
        const columnNames = columns.map((c) => c.name.trim()).filter(Boolean);
        const result = await createBoard({
          title: data.title,
          columns: columnNames,
        });
        setSelectedBoardId?.(result.boardId);
        setAddBoardModalIsOpen(false);
        navigate(0);
      }
    } catch (err) {
      setServerError(err.message || "Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  const addColumn = (e) => {
    e.preventDefault();
    setColumns((prev) => [...prev, { name: "" }]);
  };

  const removeColumn = (index) =>
    setColumns((prev) => prev.filter((_, i) => i !== index));

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
            <h2>{isLocal ? "New Local Board" : "Add New Board"}</h2>
            <button type="button" onClick={() => setAddBoardModalIsOpen(false)}>
              <CloseIcon />
            </button>
          </div>

          {canCreateApiBoard && (
            <div className="modal_board_type_toggle">
              <button
                type="button"
                className={
                  !isLocal
                    ? "modal_board_type_btn modal_board_type_btn--active"
                    : "modal_board_type_btn"
                }
                onClick={() => setIsLocal(false)}
              >
                Board partagé
              </button>
              <button
                type="button"
                className={
                  isLocal
                    ? "modal_board_type_btn modal_board_type_btn--active"
                    : "modal_board_type_btn"
                }
                onClick={() => setIsLocal(true)}
              >
                Board local
              </button>
            </div>
          )}

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
            {isLoading
              ? "Création..."
              : isLocal
                ? "Create Local Board"
                : "Create New Board"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBoard;
