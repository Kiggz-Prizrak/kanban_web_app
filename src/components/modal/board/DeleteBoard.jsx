import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { deleteBoard as deleteBoardApi } from "../../../api/boards";
import { deleteBoard as deleteBoardLocal } from "../../../store/localKanbanSlice";

const DeleteBoard = ({
  setDeleteBoardModalIsOpen,
  // API props
  boardId,
  setSelectedBoardId,
  userBoards,
  // Local props
  selectedKanban,
  onDeleted,
  isLocal = false,
  theme,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Nom du board selon le mode
  const localKanban = useSelector((state) =>
    isLocal ? state.localKanban.kanbans[selectedKanban] : null,
  );
  const boardName = isLocal
    ? (localKanban?.board ?? "")
    : (userBoards?.find((ub) => ub.board?.id === boardId)?.board?.name ?? "");

  const handleDelete = async () => {
    setIsLoading(true);
    setServerError("");

    try {
      if (isLocal) {
        dispatch(deleteBoardLocal(selectedKanban));
        setDeleteBoardModalIsOpen(false);
        onDeleted?.();
      } else {
        await deleteBoardApi(boardId);
        const remaining = userBoards.filter((ub) => ub.board?.id !== boardId);
        setSelectedBoardId?.(remaining[0]?.board?.id ?? null);
        setDeleteBoardModalIsOpen(false);
        navigate(0);
      }
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
            Are you sure you want to delete &quot;{boardName}&quot;? This action
            will remove all columns and tasks and cannot be reversed.
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
