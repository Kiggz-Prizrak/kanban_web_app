import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { DevTool } from "@hookform/devtools";

// import {  } from "../../../store/kanbanSlice";


import CloseIcon from "../../../assets/icons/CloseIcon";
import ArrowIcon from "../../../assets/icons/ArrowIcon";

const TaskEditor = () => {
  const { register, handleSubmit, control, formState } = useForm();
  const { errors } = formState;
  const dispatch = useDispatch();

  const kanban = useSelector((state) => state.kanbans[selectedKanban]);
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskError, setSubtaskError] = useState(false);
  const [status, setStatus] = useState(0);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  return (
    <div className="modal_background">
      <div className="modal_container">
        <form
          className="modal_form"
          onSubmit={handleSubmit(subForm)}
          action="submit"
        ></form>
      </div>
    </div>
  );
};


export default TaskEditor