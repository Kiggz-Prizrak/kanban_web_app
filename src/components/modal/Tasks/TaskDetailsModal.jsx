import { useDispatch } from "react-redux";
import {  useState } from "react";
import { useSelector } from "react-redux";

import CloseIcon from "../../../assets/icons/CloseIcon";
import ArrowIcon from "../../../assets/icons/ArrowIcon";

const TaskDetailsModal = ({
  setTaskDetailsModalIsOpen,
  selectedKanban,
  taskDatas,
}) => {
  const kanban = useSelector((state) => state.kanbans[selectedKanban]);
  const task = useSelector((state) =>
    state.kanbans[selectedKanban].columns[taskDatas.columnIndex].tasks.find(
      (task) => task.id == taskDatas.id
    )
  );

  const [substasksCheckedList, setSubtaskCheckedList] = useState(task.subtasks);
  const [status, setStatus] = useState(0);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);


  const handleCheckboxe = (e) => {
    const newSubstasksLit = substasksCheckedList;
    newSubstasksLit[e.target.id].checked =
      !newSubstasksLit[e.target.id].checked;

    setSubtaskCheckedList(newSubstasksLit);
  };



  const handleSubmit = () => {
    console.log(task)
    console.log(status)
    if(task.status != status) {
      console.log("bute")
    }

  }

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
            subtasks ({substasksCheckedList.filter((e) => e.checked).length} of{" "}
            {task.subtasks.length})
          </label>
          <ul>
            {substasksCheckedList.map((e, i) => {
              console.log(e.checked);
              return (
                <li key={i} className="checkbox_field_container">
                  <input
                    id={i}
                    type="checkbox"
                    value={e.checked}
                    onChange={handleCheckboxe}
                  />
                  <p
                    className={
                      e.checked ? "substaskNameChecked" : "substaskName"
                    } 
                  >
                    {e?.name} {e.checked}
                  </p>
                </li>
              ); 
            })}
          </ul> 

          <label htmlFor="status">Current Status</label>
          <div name="status" className="form_dropdown">
            <div className="form_dropdown_title">
              <h4>{kanban?.columns[status].name}</h4>
              <button
                className={dropdownIsOpen ? "form_dropdown_button_active" : ""}
                type="button"
                onClick={() => setDropdownIsOpen(!dropdownIsOpen)}
              >
                <ArrowIcon />
              </button>
            </div>
            {dropdownIsOpen ? (
              <ul className="form_dropdown_list">
                {kanban.columns
                  .filter(
                    (element) => kanban.columns.indexOf(element) != status
                  )
                  .map((value, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => setStatus(kanban.columns.indexOf(value))}
                      >
                        {value.name}
                      </button>
                    </li>
                  ))}
              </ul>
            ) : (
              ""
            )}
          </div>
          <button className="form_button_submit" onClick={handleSubmit}>
            Update Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
