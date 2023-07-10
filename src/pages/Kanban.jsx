import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import BoardColumn from "../components/BoardColumn";

const Kanban = () => {
  return (
    <>
      <Sidebar />
      <div>
        <Header />
        <div className="kanban_container"></div>
      </div>
    </>
  );
};

export default Kanban;
