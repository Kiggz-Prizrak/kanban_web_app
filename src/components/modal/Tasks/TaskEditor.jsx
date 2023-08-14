import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { DevTool } from "@hookform/devtools";

// import {  } from "../../../store/kanbanSlice";


import CloseIcon from "../../../assets/icons/CloseIcon";
import ArrowIcon from "../../../assets/icons/ArrowIcon";

const TaskEditor = ({ selectedKanban, taskDatas, setEditTaskModalIsOpen }) => {
  const { register, handleSubmit, control, formState } = useForm();
  const { errors } = formState;
  const dispatch = useDispatch();

  const kanban = useSelector((state) => state.kanbans[selectedKanban]);
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskError, setSubtaskError] = useState(false);
  const [status, setStatus] = useState(0);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  const subForm = (data) => {};

  const taskToEdit = useSelector((state) => state.kanbans[taskDatas.selectedKanban].columns[taskDatas.columnIndex].tasks.find((task) => task.id === taskDatas.id))
  console.log(taskToEdit);


  return (
    <div className="modal_background">
      <div className="modal_container">
        <form
          className="modal_form"
          onSubmit={handleSubmit(subForm)}
          action="submit"
        >
          <div className="form_title">
            <h2>Edit Board</h2>
            <button
              type="button"
              onClick={() =>
                setEditTaskModalIsOpen((prevState) => ({
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
          {/* <div className="modal_form_subs">
            {columns.map((value, i) => (
              <div key={i} className="sub_element_btn">
                <input
                  className="form_input_text"
                  id={i}
                  type="text"
                  name="column"
                  value={value.name}
                  placeholder=""
                  enterKeyHint="next"
                  onChange={setColumnName}
                />
                <button type="button" onClick={() => deleteColumn(i)}>
                  <CloseIcon />
                </button>
              </div>
            ))}
          </div> */}
        </form>
      </div>
    </div>
  );
};


export default TaskEditor