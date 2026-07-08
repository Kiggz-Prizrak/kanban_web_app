import { useState } from "react";
import { useSelector } from "react-redux";

import BoardIcon from "../assets/icons/BoardIcon";
import Logo from "../assets/Logo";
import EyeIcon from "../assets/icons/EyeIcon";
import DarkmodeButton from "./DarkmodeButton";

// Icône petit disque dur — indique un board local
const LocalIcon = ({ color = "#828FA3" }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
    title="Board local"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
  </svg>
);

const Sidebar = ({
  selectedBoardKey, // "api__{id}" | "local__{localId}"
  setSelectedBoardKey,
  setNewBoardModalIsOpen,
  userBoards, // boards API [{ id, role, board: { id, name } }]
  localKanbans, // boards locaux [{ localId, board, columns }]
}) => {
  const theme = useSelector((state) => state.theme.currentTheme);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(true);

  const totalCount = (userBoards?.length ?? 0) + (localKanbans?.length ?? 0);

  return (
    <>
      <aside
        className={`sidebar_container sidebar_container--${
          sidebarIsOpen ? "opened" : "closed"
        }`}
      >
        <div className={`sidebar_logo sidebar_logo--${theme}`}>
          <Logo color={theme === "darkmode" ? "white" : "black"} />
        </div>

        <div className={`sidebar_content sidebar_content--${theme}`}>
          <div>
            <h2>ALL BOARDS ({totalCount})</h2>
            <ul className="sidebar_menu">
              {/* ---- Boards API ---- */}
              {userBoards?.map((ub) => {
                const key = `api__${ub.board.id}`;
                const isActive = selectedBoardKey === key;
                return (
                  <li key={key}>
                    <button
                      className={
                        isActive
                          ? "sidebar_kanbanLink_active"
                          : "sidebar_kanbanLink"
                      }
                      onClick={() => setSelectedBoardKey(key)}
                    >
                      <BoardIcon color={isActive ? "#FFF" : "#828FA3"} />
                      <p>{ub.board.name}</p>
                    </button>
                  </li>
                );
              })}

              {/* ---- Boards locaux ---- */}
              {localKanbans?.map((kb) => {
                const key = `local__${kb.localId}`;
                const isActive = selectedBoardKey === key;
                return (
                  <li key={key}>
                    <button
                      className={
                        isActive
                          ? "sidebar_kanbanLink_active"
                          : "sidebar_kanbanLink"
                      }
                      onClick={() => setSelectedBoardKey(key)}
                    >
                      <BoardIcon color={isActive ? "#FFF" : "#828FA3"} />
                      <p className="sidebar_local_label">
                        {kb.board}
                        <LocalIcon color={isActive ? "#FFF" : "#828FA3"} />
                      </p>
                    </button>
                  </li>
                );
              })}

              {/* ---- Créer un board (choix API/local dans la modal) ---- */}
              <li>
                <button
                  className="sidebar_boardCreator_btn"
                  onClick={() => setNewBoardModalIsOpen(true)}
                >
                  <BoardIcon color="#635FC7" />
                  <p>+ New Board</p>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <DarkmodeButton />
            <button
              className="sideBar_hide_btn"
              onClick={() => setSidebarIsOpen(false)}
            >
              <span>
                <EyeIcon />
              </span>
              Hide Sidebar
            </button>
          </div>
        </div>
      </aside>

      {!sidebarIsOpen && (
        <button
          className="sidebar_show_button"
          onClick={() => setSidebarIsOpen(true)}
        >
          <EyeIcon color="white" />
        </button>
      )}
    </>
  );
};

export default Sidebar;
