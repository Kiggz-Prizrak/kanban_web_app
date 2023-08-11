import { useState } from "react";
import BoardColumn from "./BoardColumn";
import { DragDropContext } from "react-beautiful-dnd";
import { useSelector, useDispatch } from "react-redux";

import { dragAndDropTask } from "../store/kanbanSlice";

const KanbanBoard = ({
  setEditTaskModalIsOpen,
  setNewColumnModalIsOpen,
  selectedKanban,
  setDeleteTaskModalIsOpen,
  setTaskDetailsModalIsOpen,
}) => {
  // const [datas, setDatas] = useState(selectedKanban?.columns);


  const datas = useSelector((state) => state.kanbans[selectedKanban]);
  const dispatch = useDispatch()
  const onDragEnd = (result) => {
    dispatch(dragAndDropTask({ ...result, datas }));
  };
  return (
    <div className="board_container">
      {datas.columns.length ? (
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            {datas.columns.map((e, i) => {
              return (
                <BoardColumn
                  setEditTaskModalIsOpen={setEditTaskModalIsOpen}
                  setDeleteTaskModalIsOpen={setDeleteTaskModalIsOpen}
                  setTaskDetailsModalIsOpen={setTaskDetailsModalIsOpen}
                  key={e?.id}
                  columnIndex={i}
                  column={e?.name}
                  tasks={e?.tasks}
                  columnId={e?.id}
                />
              );
            })}
          </DragDropContext>
          <button
            className="boardKanban_columnAdder_btn"
            onClick={() => setNewColumnModalIsOpen(true)}
          >
            + New Column
          </button>
        </>
      ) : (
        <>
          <div className="board_unless_column">
            <h3>This board is empty. Create a new column to get started</h3>
            <button
              onClick={() => setNewColumnModalIsOpen(true)}
              className="header_taskAdder"
            >
              + Add New Column
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default KanbanBoard;
