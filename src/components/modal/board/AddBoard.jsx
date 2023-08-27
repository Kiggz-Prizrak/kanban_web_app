import { useState } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useDispatch } from "react-redux";

import { addNewBoard } from "../../../store/kanbanSlice";

import { useSelector } from "react-redux";

import CloseIcon from "../../../assets/icons/CloseIcon";

import { idGenerator } from "../../../variables";

const AddBoard = ({ setAddBoardModalIsOpen, theme }) => {
  console.log(idGenerator("board"));

  const { register, handleSubmit, control, formState } = useForm();
  const { errors } = formState;
  const dispatch = useDispatch();

  const [columns, setColumns] = useState([]);
  const [errorTitle, setErrorTitle] = useState(false);

  const kanbansList = useSelector((state) => state.kanbans);

  const subForm = (data) => {
    setErrorTitle(false);

    if (!kanbansList.map((e) => e.board).includes(data.board)) {
      dispatch(addNewBoard({ ...data, id: idGenerator("board"), columns }));
      setAddBoardModalIsOpen(false);
    } else {
      setErrorTitle(true);
    }
  };

  const addNewColumn = (e) => {
    e.preventDefault();
    setColumns((list) => [
      ...list,
      { name: "", id: idGenerator("column", columns.length + 1), taks: [] },
    ]);
    console.log(columns);
  };

  const deleteColumn = (columnIndex) => {
    setColumns((list) => list.filter((element, index) => index != columnIndex));
  };

  const setColumnName = (e) => {
    e.preventDefault();
    let newColumns = Array.from(columns);
    newColumns.map((_, i) => {
      if (i == e.target.id) {
        newColumns[i] = {
          name: e.target.value,
          id: idGenerator("column", i),
          tasks: [],
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
          // onSubmit={(e) => handleSubmit(e)}
          onSubmit={handleSubmit(subForm)}
          action="submit"
        >
          <div className={`form_title form_title--${theme}`}>
            <h2>Add New Board</h2>
            <button type="button" onClick={() => setAddBoardModalIsOpen(false)}>
              <CloseIcon />
            </button>
          </div>

          <label htmlFor="name">Board Name</label>
          <input
            className={
              errors.name?.message
                ? "errorInput"
                : `form_input_text form_input_text--${theme}`
            }
            id="name"
            type="text"
            name="board"
            placeholder="Board name"
            enterKeyHint="next"
            {...register("board", {
              required: "please prov ide this field",
            })}
          />
          <p className="errorMessage">{errors.board?.message}</p>

          {columns.length ? <label htmlFor="columns">Board Columns</label> : ""}
          <div className="modal_form_subs">
            {columns.map((value, i) => (
              <div key={i} className="sub_element_btn">
                <input
                  className={`form_input_text form_input_text--${theme}`}
                  id={i}
                  type="text"
                  name="column"
                  // key={i}
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
          {errorTitle ? (
            <p className="errorMessage">Board already Exist</p>
          ) : (
            ""
          )}
          <button
            type="button"
            className={`form_secondary_button form_secondary_button--${theme}`}
            onClick={addNewColumn}
          >
            + Add New Column
          </button>
          <button className="form_button_submit" type="submit">
            Create New Board
          </button>
        </form>

        <DevTool control={control} />
      </div>
    </div>
  );
};

export default AddBoard;
