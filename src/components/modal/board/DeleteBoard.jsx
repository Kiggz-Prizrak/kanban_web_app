import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { deleteBoard } from "../../../api/boards";

const DeleteBoard = ({
  setDeleteBoardModalIsOpen,
  boardId,
  setSelectedBoardId,
  userBoards,
  theme,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const boardName =
    userBoards?.find((ub) => ub.board?.id === boardId)?.board?.name ?? "";

  const handleDelete = async () => {
    setIsLoading(true);
    setServerError("");

    try {
      await deleteBoard(boardId);

      // Sélectionne le premier board restant
      const remaining = userBoards.filter((ub) => ub.board?.id !== boardId);
      setSelectedBoardId(remaining[0]?.board?.id ?? null);

      setDeleteBoardModalIsOpen(false);

      // Recharge le loader pour mettre à jour la sidebar
      navigate(0);
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
          <h2 className={`modal_delete_title modal_delete_title--${theme}`}>
            Delete this board?
          </h2>
          <p>
            Are you sure you want to delete the &quot;{boardName}&quot; board?
            This action will remove all columns and tasks and cannot be
            reversed.
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
              onClick={() => setDeleteBoardModalIsOpen(false)}
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

export default DeleteBoard;
