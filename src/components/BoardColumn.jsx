import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import Round from "../assets/icons/Round";

const BoardColumn = ({
  column,
  columnIndex,
  boardId,
  isAdmin,
  setEditTaskModal,
  setDeleteTaskModal,
  setTaskDetailsModal,
  onBoardRefresh,
}) => {
  return (
    <div className="board_column_container">
      <h3>
        <span>
          <Round color="#8471F2" />
        </span>
        {column.name} {column.tasks.length ? `(${column.tasks.length})` : ""}
      </h3>

      <Droppable droppableId={String(column.id)}>
        {(provider) => (
          <div
            {...provider.droppableProps}
            className="board_column"
            ref={provider.innerRef}
          >
            {column.tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                columnId={column.id}
                boardId={boardId}
                isAdmin={isAdmin}
                setEditTaskModal={setEditTaskModal}
                setDeleteTaskModal={setDeleteTaskModal}
                setTaskDetailsModal={setTaskDetailsModal}
                onBoardRefresh={onBoardRefresh}
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
