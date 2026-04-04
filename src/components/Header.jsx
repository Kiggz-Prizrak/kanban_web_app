import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import CirclesOptions from "../assets/icons/CirclesOptions";
import { useAuth } from "../context/AuthContext";

const Header = ({
  boardName,
  isAdmin,
  hasColumns = false,
  setNewTaskModalIsOpen,
  setEditBoardModalIsOpen,
  setDeleteBoardModalIsOpen,
  setMembersModalIsOpen,
}) => {
  const theme = useSelector((state) => state.theme.currentTheme);
  const [optionsIsOpen, setOptionsIsOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const hasBoard = Boolean(boardName);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className={`header_container header_container--${theme}`}>
      <h1>{boardName || "No board selected"}</h1>

      <div className="header_btnSection">
        {hasBoard && (
          <>
            <button
              className={
                hasColumns
                  ? "header_taskAdder"
                  : "header_taskAdder header_taskAdder--disabled"
              }
              onClick={() => setNewTaskModalIsOpen(true)}
              disabled={!hasColumns}
            >
              + Add New Task
            </button>

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
                      setMembersModalIsOpen(true);
                    }}
                  >
                    Membres
                  </button>

                  {isAdmin && (
                    <>
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
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Logout — toujours visible */}
        <button
          className={`header_logout_btn header_logout_btn--${theme}`}
          onClick={handleLogout}
          title={`Déconnexion (${user?.username ?? ""})`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
