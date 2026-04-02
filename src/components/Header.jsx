import { useState } from "react";
import { useSelector } from "react-redux";
import CirclesOptions from "../assets/icons/CirclesOptions";

const Header = ({
  boardName,
  isAdmin,
  hasColumns = false,
  setNewTaskModalIsOpen,
  setEditBoardModalIsOpen,
  setDeleteBoardModalIsOpen,
}) => {
  const theme = useSelector((state) => state.theme.currentTheme);
  const [optionsIsOpen, setOptionsIsOpen] = useState(false);

  const hasBoard = Boolean(boardName);

  return (
    <header className={`header_container header_container--${theme}`}>
      <h1>{boardName || "No board selected"}</h1>

      {hasBoard && (
        <div className="header_btnSection">
          <button
            className={
              hasColumns
                ? "header_taskAdder"
                : "header_taskAdder header_taskAdder--enabled"
            }
            onClick={() => setNewTaskModalIsOpen(true)}
            disabled={!hasColumns}
          >
            + Add New Task
          </button>

          {isAdmin && (
            <div className="header_option_btn">
              <button onClick={() => setOptionsIsOpen((prev) => !prev)}>
                <CirclesOptions />
              </button>

              {optionsIsOpen && (
                <div
                  className={`optin_btn_windows optin_btn_windows--${theme}`}
                >
                  <button
                    className="option_edit_btn"
                    onClick={() => {
                      setOptionsIsOpen(false);
                      setEditBoardModalIsOpen(true);
                    }}
                  >
                    Edit Board
                  </button>

                  <button
                    className="option_delete_btn"
                    onClick={() => {
                      setOptionsIsOpen(false);
                      setDeleteBoardModalIsOpen(true);
                    }}
                  >
                    Delete Board
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
