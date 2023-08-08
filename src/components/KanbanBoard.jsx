import { useState } from "react";
import BoardColumn from "./BoardColumn";
import { DragDropContext } from "react-beautiful-dnd";
import { useSelector } from "react-redux";

const KanbanBoard = ({
  setEditTaskModalIsOpen,
  setNewColumnModalIsOpen,
  selectedKanban,
  setDeleteTaskModalIsOpen,
  setTaskDetailsModalIsOpen,
}) => {
  // const [datas, setDatas] = useState(selectedKanban?.columns);

  const datas = useSelector((state) => state.kanbans[selectedKanban]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId, setEditTaskModalIsOpen } = result;

    // if (!destination) return;

    // if (
    //   destination.droppableId === source.droppableId &&
    //   destination.index === source.index
    // ) {
    //   return;
    // }

    // const start = datas.find((e) => e.name === source.droppableId);
    // const finish = datas.find((e) => e.name === destination.droppableId);

    // if (start === finish) {
    //   console.log(destination.source);
    //   console.log(datas);

    //   const columnIndex = datas.findIndex(
    //     (e) => e.name == destination.droppableId
    //   );

    //   const newColumns = Array.from(
    //     datas.find((e) => e.name === source.droppableId).tasks
    //   );
    //   console.log(newColumns);

    //   const element = newColumns[source.index];
    //   newColumns.splice(source.index, 1);
    //   newColumns.splice(destination.index, 0, element);

    //   const newDatas = datas;
    //   newDatas[columnIndex] = {
    //     name: destination.droppableId,
    //     tasks: newColumns,
    //   };

    //   setDatas(newDatas);
    //   console.log(datas);
    // }
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
                  id={e?.id}
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
