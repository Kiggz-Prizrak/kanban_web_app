import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { DevTool } from "@hookform/devtools";

import { addNewTask } from "../../../store/kanbanSlice";

import { idGenerator } from "../../../variables";

import CloseIcon from "../../../assets/icons/CloseIcon";
import ArrowIcon from "../../../assets/icons/ArrowIcon";

const AddTask = ({ setNewTaskModalIsOpen, selectedKanban, theme }) => {
  const { register, handleSubmit, control, formState } = useForm();
  const { errors } = formState;
  const dispatch = useDispatch();

  const kanban = useSelector((state) => state.kanbans[selectedKanban]);
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskError, setSubtaskError] = useState(false);
  const [status, setStatus] = useState(0);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  const subForm = (data) => {
    setSubtaskError(false);

    subtasks.forEach((subtask) => {
      if (subtasks.filter((e) => e.name == subtask.name).length > 1) {
        setSubtaskError(true);
      }
    });

    const newTask = {
      title: data.title,
      id: idGenerator("task"),
      description: data.description,
      status: kanban.columns[status].name,
      subtasks,
    };

    if (!subtaskError) {
      dispatch(addNewTask({ selectedKanban, column: status, newTask }));
      setNewTaskModalIsOpen(false);
    }
  };

  const addNewSubtask = (e) => {
    e.preventDefault();
    setSubtasks((list) => [
      ...list,
      {
        name: "",
        id: idGenerator("subtask", subtasks.length + 1),
        isChecked: false,
        subtasks: [],
      },
    ]);
  };

  const deleteSubtask = (columnIndex) => {
    setSubtasks((list) =>
      list.filter((element, index) => index != columnIndex)
    );
  };

  //// add better optimisation later
  const setSubtaskName = (e) => {
    e.preventDefault();
    let newSubtasks = Array.from(subtasks);
    newSubtasks.map((element, i) => {
      if (i == e.target.id) {
        newSubtasks[i] = {
          name: e.target.value,
          id: idGenerator("substask", i),
          isChecked: false,
        };
      }
    });
    setSubtasks(newSubtasks);
  };

  return (
    <div className="modal_background">
      <div className={`modal_container modal_container--${theme}`}>
        <form
          className="modal_form"
          onSubmit={handleSubmit(subForm)}
          action="submit"
        >
          <div className={`form_title form_title--${theme}`}>
            <h2>Add New Task</h2>
            <button type="button" onClick={() => setNewTaskModalIsOpen(false)}>
              <CloseIcon />
            </button>
          </div>

          <label htmlFor="name">Title</label>
          <input
            className={errors.name?.message ? "errorInput" : "form_input_text"}
            id="title"
            type="text"
            name="title"
            placeholder="title"
            enterKeyHint="next"
            {...register("title", {
              required: "please prov ide this field",
              // pattern: {
              //   value:
              //     /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/,
              //   message: "please provide valid data",
              // },
            })}
          />
          <p className="errorMessage">{errors.title?.message}</p>

          <label htmlFor="name">Description</label>
          <input
            className={errors.name?.message ? "errorInput" : "form_input_text"}
            id="description"
            type="text"
            name="description"
            placeholder="description"
            enterKeyHint="next"
            {...register("description", {
              required: "please prov ide this field",
              // pattern: {
              //   value:
              //     /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/,
              //   message: "please provide valid data",
              // },
            })}
          />
          <p className="errorMessage">{errors.description?.message}</p>

          {subtasks.length ? <label htmlFor="columns">Subtasks</label> : ""}
          <div className="modal_form_subs">
            {subtasks.map((value, i) => (
              <div key={i} className="sub_element_btn">
                <input
                  className="form_input_text"
                  id={i}
                  type="text"
                  name="column"
                  value={value.name}
                  placeholder=""
                  enterKeyHint="next"
                  onChange={setSubtaskName}
                />
                <button type="button" onClick={() => deleteSubtask(i)}>
                  <CloseIcon />
                </button>
              </div>
            ))}
          </div>
          <button
            className={`form_secondary_button form_secondary_button--${theme}`}
            onClick={addNewSubtask}
          >
            + Add New Subtask
          </button>

          <label htmlFor="status">Status</label>
          <div name="status" className="form_dropdown">
            <div
              className={`form_dropdown_title form_dropdown_title--${theme}`}
            >
              <h4>{kanban.columns[status].name}</h4>
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
                        className="form_button_submit"
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

          <button className="form_button_submit" type="submit">
            Create New Board
          </button>
        </form>

        <DevTool control={control} />
      </div>
    </div>
  );
};

export default AddTask;
