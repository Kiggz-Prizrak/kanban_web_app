import { useDispatch } from "react-redux";
import { deleteTask } from "../../../store/kanbanSlice";

const DeleteTask = ({
  setDeleteTaskModalIsOpen,
  deleteTaskModalIsOpen,
}) => {
  const dispatch = useDispatch();

  console.log(deleteTaskModalIsOpen);

  const handleDelete = () => {
    dispatch(deleteTask(deleteTaskModalIsOpen));
    setDeleteTaskModalIsOpen((prevState) => ({
      ...prevState,
      columnIndex: "",
      id: "",
      open: false,
    }));
  };

  return (
    <div className="modal_background">
      <div className="modal_container">
        <div className="modal_content">
          <h2 className="madal_delete_title">Delete This Task?</h2>
          <p>
            Are you sure you want to delete the ‘Build settings UI’ task and its
            subtasks? This action cannot be reversed.
          </p>
          <div className="modal_delete_btn_section">
            <button className="form_delete_button" onClick={handleDelete}>
              Delete
            </button>
            <button
              className="form_secondary_button"
              onClick={() =>
                setDeleteTaskModalIsOpen((prevState) => ({
                  ...prevState,
                  columnIndex: "",
                  id: "",
                  open: false,
                }))
              }
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteTask;
