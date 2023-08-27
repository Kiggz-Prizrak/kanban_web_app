import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { idGenerator } from "../../../variables";

import { DevTool } from "@hookform/devtools";

import { addNewColumn } from "../../../store/kanbanSlice";

import CloseIcon from "../../../assets/icons/CloseIcon";

const AddColumn = ({ setNewColumnModalIsOpen, selectedKanban, theme }) => {
  const { register, handleSubmit, control, formState } = useForm();
  const { errors } = formState;
  const dispatch = useDispatch();

  const datas = useSelector((state) => state.kanbans[selectedKanban]);

  const [columnError, setColumnError] = useState(false);

  const subForm = (data) => {
    console.log(data);
    if (!datas.columns.map((e) => e.name).includes(data.column)) {
      console.log("error");
      setColumnError(false);

      dispatch(
        addNewColumn({
          index: selectedKanban,

          newColumn: {
            name: data.column,
            id: idGenerator("column", datas.columns.length + (1).length + 1),
            tasks: [],
          },
        })
      );
      setNewColumnModalIsOpen(false);
    } else {
      setColumnError(true);
    }
  };

  return (
    <>
      <div className="modal_background">
        <div className={`modal_container modal_container--${theme}`}>
          <form
            className="modal_form"
            onSubmit={handleSubmit(subForm)}
            action="submit"
          >
            <div className={`form_title form_title--${theme}`}>
              <h2>Add New Column</h2>
              <button
                type="button"
                onClick={() => setNewColumnModalIsOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <label htmlFor="name">Columns Name</label>
            <input
              className={
                errors.name?.message
                  ? "errorInput"
                  : `form_input_text form_input_text--${theme}`
              }
              id="name"
              type="text"
              name="column"
              placeholder="Board name"
              enterKeyHint="next"
              {...register("column", {
                // required: "please prov ide this field",
                // pattern: {
                //   value:
                //     /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/,
                //   message: "please provide valid data",
                // },
              })}
            />
            <p className="errorMessage">
              {errors.board?.message}
              {columnError ? "Duplicate column" : ""}
            </p>
            <button className="form_button_submit" type="submit">
              Create New Column
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddColumn;
