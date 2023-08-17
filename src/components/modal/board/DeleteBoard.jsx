import { useDispatch } from "react-redux";
import { deleteBoard } from "../../../store/kanbanSlice";

const DeleteBoard = ({
  setDeleteBoardModalIsOpen,
  selectedKanban,
  setSelectedKanban,
  theme
}) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteBoard(selectedKanban));
    setDeleteBoardModalIsOpen(false);
    if (selectedKanban > 0) {
      setSelectedKanban(selectedKanban - 1);
    }
  };

  return (
    <div className="modal_background">
      <div className={`modal_container modal_container--${theme}`}>
        <div className="modal_content">
          <h2 className={`modal_delete_title modal_delete_title--{theme}`}>
            Delete this board?
          </h2>
          <p>
            Are you sure you want to delete the ‘Platform Launch’ board? This
            action will remove all columns and tasks and cannot be reversed.
          </p>
          <div className="modal_delete_btn_section">
            <button className="form_delete_button" onClick={handleDelete}>
              Delete
            </button>
            <button
              className={`form_secondary_button form_secondary_button--${theme}`}
              onClick={() => setDeleteBoardModalIsOpen(false)}
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
