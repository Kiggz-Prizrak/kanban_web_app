import { useState } from "react";
import CirclesOptions from "../assets/icons/CirclesOptions";
import { useSelector } from "react-redux";

const Header = ({
  setNewTaskModalIsOpen,
  setEditBoardModalIsOpen,
  kanbanTitle,
  selectedKanban,
  setDeleteBoardModalIsOpen,
}) => {
  const isKanban = useSelector((state) => state.kanbans).length;
  const isColumns = useSelector((state) => state.kanbans[selectedKanban].columns).length;
  const theme = useSelector((state) => state.theme.currentTheme)

  const [optionsIsOpen, setOptionsIsOpen] = useState(false);
  return (
    <header className={`header_container header_container--${theme}`}>
      <h1>{kanbanTitle}</h1>
      {isKanban ? (
        <div className="header_btnSection">
          <button
            className={
              isColumns
                ? "header_taskAdder"
                : "header_taskAdder header_taskAdder--enabled"
            }
            onClick={() => setNewTaskModalIsOpen(true)}
          >
            + Add New Task
          </button>
          <div className="header_option_btn">
            <button onClick={() => setOptionsIsOpen(!optionsIsOpen)}>
              <CirclesOptions />
            </button>
            {optionsIsOpen ? (
              <div className={`optin_btn_windows optin_btn_windows--${theme}`}>
                <button
                  className="option_edit_btn"
                  onClick={() => {
                    setOptionsIsOpen(!optionsIsOpen);
                    setEditBoardModalIsOpen(true);
                  }}
                >
                  Edit Board
                </button>
                <button
                  className="option_delete_btn"
                  onClick={() => {
                    setOptionsIsOpen(!optionsIsOpen);
                    setDeleteBoardModalIsOpen(true);
                  }}
                >
                  Delete Board
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </header>
  );
};

export default Header;
