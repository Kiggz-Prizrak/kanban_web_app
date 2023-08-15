import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { editTask } from "../../../store/kanbanSlice";
import { idGenerator } from "../../../variables";


// import {  } from "../../../store/kanbanSlice";

import CloseIcon from "../../../assets/icons/CloseIcon";

const TaskEditor = ({ selectedKanban, taskDatas, setEditTaskModalIsOpen }) => {
  const taskToEdit = useSelector((state) =>
    state.kanbans[taskDatas.selectedKanban].columns[
      taskDatas.columnIndex
    ].tasks.find((task) => task.id === taskDatas.id)
  );

  const { register, handleSubmit, control, formState } = useForm();
  const { errors } = formState;
  const dispatch = useDispatch();

  const [taskDescription, setTaskDescription] = useState(taskDatas.description);
  const [subtasks, setSubtasks] = useState(Array.from(taskToEdit.subtasks));
  // const [subtaskError, setSubtaskError] = useState(false);

  const subForm = (data) => {
    console.log(data);
    const newTask = {
      title: data.title,
      subtasks,
      description: taskDescription,
      ...taskDatas,
    };
    console.log(newTask);
    dispatch(editTask({selectedKanban, columnIndex: taskDatas.columnIndex, newTask}));
  };

  const deleteSubtask = (id) => {

    setSubtasks((list) =>
      list.filter((item) => item.id != id)
    );
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

  const setDescription = (e) => {
    e.preventDefault();
    setTaskDescription(e.target.value);
  };

  const setColumnName = (e) => {
    e.preventDefault();
    let newSubtasks = Array.from(subtasks);
    newSubtasks.map((element, i) => {
      if (i == e.target.id) {
        newSubtasks[i] = {
          id: subtasks[i].id,
          name: e.target.value,
          // id: idGenerator("subtasks", i),
          tasks: element.tasks,
        };
      }
    });
    setSubtasks(newSubtasks);
  };

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

          <label htmlFor="description">title</label>
          <input
            className={
              errors.name?.message
                ? "errorInput"
                : "form_input_text description_field"
            }
            id="title"
            type="text"
            name="descTitleription"
            // value={kanban?.board}
            defaultValue={taskToEdit.title}
            placeholder={taskToEdit.title}
            enterKeyHint="next"
            {...register("title", {
              // required: "please prov ide this field",
              // pattern: {
              //   value:
              //     /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/,
              //   message: "please provide valid data",
              // },
            })}
          />
          <p className="errorMessage">{errors.title?.message}</p>

          <label htmlFor="description">Description</label>
          <textarea
            onChange={setDescription}
            className={
              errors.name?.message
                ? "errorInput"
                : "form_input_text_description"
            }
            defaultValue={taskToEdit.description}
            name="description"
          ></textarea>
          <p className="errorMessage">{errors.description?.message}</p>

          <label htmlFor="description">Subtasks</label>
          <div className="modal_form_subs">
            {subtasks.map((value, i) => (
              <div key={i} className="sub_element_btn">
                <input
                  className="form_input_text"
                  id={value.id}
                  type="text"
                  name="subtasks"
                  defaultValue={value.name}
                  placeholder={value.name}
                  enterKeyHint="next"
                  onChange={setColumnName}
                />
                <button type="button" onClick={() => deleteSubtask(value.id)}>
                  <CloseIcon />
                </button>
              </div>
            ))}
            <button className="form_secondary_button" onClick={addNewSubtask}>
              + Add New Subtask
            </button>
          </div>
          <button className="form_button_submit" type="submit">
            Saves Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskEditor;
