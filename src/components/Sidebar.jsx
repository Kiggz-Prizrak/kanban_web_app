import BoardIcon from "../assets/icons/BoardIcon";
import Logo from "../assets/Logo";
import EyeIcon from "../assets/icons/EyeIcon";
import DarkmodeButton from "./DarkmodeButton";
const Sidebar = ({
  selectedKanban,
  kanbansList,
  setSelectedKanban,
  setNewBoardModalIsOpen,
}) => {

  return (
    <aside>
      <div className="sidebar_logo">
        <Logo />
      </div>
      <div className="sidebar_content">
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
          <button className="sideBar_hide_btn">
            <span>
              <EyeIcon />
            </span>
            Hide Sidebar
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
