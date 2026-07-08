import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { useSelector } from "react-redux";

import CirclesOptions from "../assets/icons/CirclesOptions";
import CloseIcon from "../assets/icons/CloseIcon";
import EditIcon from "../assets/icons/EdditIcon";

const TaskCard = ({
  task,
  index,
  columnId,
  boardId,
  isAdmin,
  setEditTaskModal,
  setDeleteTaskModal,
  setTaskDetailsModal,
  onBoardRefresh,
}) => {
  const theme = useSelector((state) => state.theme.currentTheme);
  const [optionIsOpen, setOptionIsOpen] = useState(false);

  // substasks est le nom du champ retourné par ton back (typo conservée)
  const subtasksTotal = task.substasks?.length ?? 0;
  const subtasksCompleted =
    task.substasks?.filter((s) => s.isCompleted).length ?? 0;

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`task_item task_item--${theme}`}
        >
          <div className="task_item_text">
            <button
              className={`task_button_title task_button_title--${theme}`}
              onClick={() =>
                setTaskDetailsModal({
                  open: true,
                  taskId: task.id,
                  columnId,
                })
              }
            >
              <h4>{task.title}</h4>
            </button>

            {subtasksTotal > 0 && (
              <p>
                {subtasksCompleted} of {subtasksTotal} subtasks
              </p>
            )}
          </div>

          {optionIsOpen ? (
            <div className={`task_option task_option--${theme}`}>
              <button
                onClick={() => {
                  setEditTaskModal({ open: true, taskId: task.id, columnId });
                  setOptionIsOpen(false);
                }}
              >
                <EditIcon />
              </button>
              {isAdmin && (
                <button
                  onClick={() => {
                    setDeleteTaskModal({
                      open: true,
                      taskId: task.id,
                      columnId,
                    });
                    setOptionIsOpen(false);
                  }}
                >
                  <CloseIcon />
                </button>
              )}
              <button
                className="task_option_button_closer"
                onClick={() => setOptionIsOpen(false)}
              >
                <CirclesOptions />
              </button>
            </div>
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
