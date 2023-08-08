import { useState } from "react";

import { Draggable } from "react-beautiful-dnd";

import CirclesOptions from "../assets/icons/CirclesOptions";
import CloseIcon from "../assets/icons/CloseIcon";
import EditIcon from "../assets/icons/EdditIcon";

const TaskCard = ({
  task,
  index,
  columnIndex,
  setEditTaskModalIsOpen,
  setDeleteTaskModalIsOpen,
  setTaskDetailsModalIsOpen,
}) => {
  const substasksTotal = task.subtasks.length;
  const substasksCompleted = task.subtasks.filter(
    (subtask) => subtask.isCompleted
  ).length;

  // console.log(task)
  const [OptionIsOpen, setOptionIsOpen] = useState(false);

  return (
    <Draggable draggableId={task.title} index={index}>
      {(provided) => (
        <div
          key={`task-${index}`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="task_item"
        >
          <div className="task_item_text">
            <button
              className="task_button_title"
              onClick={() =>
                setTaskDetailsModalIsOpen((prevState) => ({
                  ...prevState,
                  columnIndex,
                  id: task.id,
                  open: true,
                }))
              }
            >
              <h4>{task.title}</h4>
            </button>
            {substasksTotal ? (
              <p>
                {substasksCompleted} of {substasksTotal} substasks
              </p>
            ) : (
              ""
            )}
          </div>
          {OptionIsOpen ? (
            <>
              <div className="task_option">
                <button onClick={() => setEditTaskModalIsOpen(true)}>
                  <EditIcon />
                </button>
                <button
                  onClick={() =>
                    setDeleteTaskModalIsOpen((prevState) => ({
                      ...prevState,
                      columnIndex,
                      id: task.id,
                      open: true,
                    }))
                  }
                >
                  <CloseIcon />
                </button>
                <button
                  className="task_option_button_closer"
                  onClick={() => setOptionIsOpen(false)}
                >
                  <CirclesOptions />
                </button>
              </div>
            </>
          ) : (
            <button onClick={() => setOptionIsOpen(true)}>
              <CirclesOptions />
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
