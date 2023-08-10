import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { updateSubtask } from "../../../store/kanbanSlice";

import CloseIcon from "../../../assets/icons/CloseIcon";
import ArrowIcon from "../../../assets/icons/ArrowIcon";

const TaskDetailsModal = ({
  setTaskDetailsModalIsOpen,
  selectedKanban,
  taskDatas,
}) => {

  const task = useSelector((state) =>
    state.kanbans[selectedKanban].columns[taskDatas.columnIndex].tasks.find(
      (task) => task.id == taskDatas.id
    )
  );

  const dispatch = useDispatch();

  const handleCheckboxe = (e) => {
    console.log(e.target.checked);
    console.log(e.target.id);
    dispatch(
      updateSubtask({
        subtaskId: e.target.id,
        taskId: task.id,
        selectedKanban,
        isChecked: e.target.checked,
        columnIndex: taskDatas.columnIndex,
      })
    );
  };

  return (
    <div className="modal_background">
      <div className="modal_container">
        <div className="modal_content">
          <div className="form_title">
            <h2>{task?.title}</h2>
            <button
              type="button"
              onClick={() =>
                setTaskDetailsModalIsOpen((prevState) => ({
                  ...prevState,
                  columnIndex: "",
                  id: "",
                  open: false,
                }))
              }
            >
              <CloseIcon />
            </button>
          </div>
          <p>{task?.description}</p>

          <label htmlFor="subtasks">
            subtasks (
            {task.subtasks.filter((subtask) => subtask.isChecked).length} of{" "}
            {task.subtasks.length})
          </label>
          <ul>
            {task.subtasks.map((subtask, i) => (
              <li key={i} className="checkbox_field_container">
                <input
                  id={subtask.id}
                  type="checkbox"
                  checked={subtask.isChecked}
                  // value={subtask.isChecked}
                  onChange={handleCheckboxe}
                />
                <p
                  className={
                    subtask.isChecked ? "substaskNameChecked" : "substaskName"
                  }
                >
                  {subtask?.name} {subtask.isChecked}
                </p>
              </li>
            ))}
          </ul>

  
          <button className="form_button_submit" onClick={() => {
             setTaskDetailsModalIsOpen((prevState) => ({
               ...prevState,
               columnIndex: "",
               id: "",
               open: false,
             }));
          }}>Update Task</button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
