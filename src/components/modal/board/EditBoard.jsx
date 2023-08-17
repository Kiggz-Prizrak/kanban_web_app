import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { DevTool } from "@hookform/devtools";

import { editBoard } from "../../../store/kanbanSlice";

import { idGenerator } from "../../../variables";

import CloseIcon from "../../../assets/icons/CloseIcon";

const EditBoard = ({ setEditBoardModalIsOpen, selectedKanban, theme }) => {
  const { register, handleSubmit, control, formState } = useForm();
  const { errors } = formState;
  const dispatch = useDispatch();

  const kanban = useSelector((state) => state.kanbans[selectedKanban]);

  const [columns, setColumns] = useState(kanban.columns);
  const [columnError, setColumnError] = useState(false);

  const subForm = (data) => {
    setColumnError(false);
    if (!data.board) {
      data.board = kanban.board;
    }
    columns.forEach((column) => {
      if (columns.filter((e) => e.name == column.name).length > 1) {
        setColumnError(true);
      }
    });

    const newBoard = { ...data, columns };

    if (!columnError) {
      dispatch(editBoard({ selectedKanban, newBoard }));
      setEditBoardModalIsOpen(false);
    }
  };

  const addNewColumn = (e) => {
    e.preventDefault();
    setColumns((list) => [
      ...list,
      { name: "", id: idGenerator("column", columns.length + 1), tasks: [] },
    ]);
    console.log(columns);
  };

  const deleteColumn = (columnIndex) => {
    setColumns((list) => list.filter((element, index) => index != columnIndex));
  };

  const setColumnName = (e) => {
    e.preventDefault();
    let newColumns = Array.from(columns);
    newColumns.map((element, i) => {
      if (i == e.target.id) {
        newColumns[i] = {
          name: e.target.value,
          id: idGenerator("column", i),
          tasks: element.tasks,
        };
      }
    });
    setColumns(newColumns);
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
            <h2>Edit Board</h2>
            <button
              type="button"
              onClick={() => setEditBoardModalIsOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>

          <label htmlFor="name">Board Name</label>
          <input
            className={errors.name?.message ? "errorInput" : "form_input_text"}
            id="name"
            type="text"
            name="board"
            // value={kanban?.board}
            placeholder={kanban?.board}
            enterKeyHint="next"
            {...register("board", {
              // required: "please prov ide this field",
              // pattern: {
              //   value:
              //     /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/,
              //   message: "please provide valid data",
              // },
            })}
          />
          <p className="errorMessage">{errors.board?.message}</p>

          {columns.length ? <label htmlFor="columns">Board Columns</label> : ""}
          <div className="modal_form_subs">
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
          </div>

          <button
            className={`form_secondary_button form_secondary_button--${theme}`}
            onClick={addNewColumn}
          >
            + Add New Column
          </button>
          <button className="form_button_submit" type="submit">
            Saves Changes
          </button>
        </form>

        <DevTool control={control} />
      </div>
    </div>
  );
};

export default EditBoard;
