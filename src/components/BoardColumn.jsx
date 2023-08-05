import TaskCard from "./TaskCard";
import Round from "../assets/icons/Round";
import { Droppable } from "react-beautiful-dnd";

const BoardColumn = ({
  column,
  tasks,
  color,
  setEditTaskModalIsOpen,
  setDeleteTaskModalIsOpen,
  columnIndex,
}) => {
  return (
    <div className="board_column_container">
      <h3>
        <span>
          <Round color="#8471F2" />
        </span>
        {column}
      </h3>
      <Droppable droppableId={column}>
        {(provider) => (
          <div
            {...provider.droppableProps}
            className="board_column"
            ref={provider.innerRef}
          >
            {tasks?.map((task, index) => (
              <TaskCard
                // key={task.index}
                setDeleteTaskModalIsOpen={setDeleteTaskModalIsOpen}
                setEditTaskModalIsOpen={setEditTaskModalIsOpen}
                key={index}
                task={task}
                index={index}
                columnIndex={columnIndex}
              />
            ))}
            {provider.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default BoardColumn;
