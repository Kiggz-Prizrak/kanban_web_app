import BoardIcon from "../assets/icons/BoardIcon";
import Logo from "../assets/Logo";
import EyeIcon from "../assets/icons/EyeIcon";
import DarkmodeButton from "./DarkmodeButton";
import { useSelector } from "react-redux";
import { useState } from "react";



const Sidebar = ({
  selectedKanban,
  kanbansList,
  setSelectedKanban,
  setNewBoardModalIsOpen,
}) => {

  const theme = useSelector((state) => state.theme.currentTheme)
const [sidebarIsOpen, setSidebarIsOpen] = useState(true)


  return (
    <>
      <aside
        className={`sidebar_container sidebar_container--${
          sidebarIsOpen ? "opened" : "closed"
        }`}
      >
        <div className={`sidebar_logo sidebar_logo--${theme} `}>
          <Logo color={theme === "darkmode" ? "white" : "black"} />
        </div>
        <div className={`sidebar_content sidebar_content--${theme} `}>
          <div>
            <h2>ALL BOARDS ({kanbansList.length})</h2>
            <ul className="sidebar_menu">
              {kanbansList.map((e, i) => (
                <li key={i}>
                  <button
                    className={
                      selectedKanban === i
                        ? "sidebar_kanbanLink_active"
                        : "sidebar_kanbanLink"
                    }
                    onClick={() => setSelectedKanban(i)}
                  >
                    <BoardIcon
                      color={selectedKanban === i ? "#FFF" : "#828FA3"}
                    />
                    <p>{e.board}</p>
                  </button>
                </li>
              ))}
              <li>
                <button
                  className="sidebar_boardCreator_btn"
                  onClick={() => setNewBoardModalIsOpen(true)}
                >
                  <BoardIcon color="#635FC7" />
                  <p>+ Create New Board</p>
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
      {sidebarIsOpen ? (
        ""
      ) : (
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
