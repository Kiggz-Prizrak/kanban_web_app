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

    
    // const { destination, source, draggableId, setEditTaskModalIsOpen } = result;

    // console.log("destination : ")
    // console.log(destination);
    // console.log("source : ")
    // console.log(source);
    // console.log("dragableId : ")
    // console.log(draggableId);

    // if (!destination) return;

    // if (
    //   destination.droppableId === source.droppableId &&
    //   destination.index === source.index
    // ) {
    //   console.log("no change")
    //   return;
    // }

    // const start = datas.columns.find((e) => e.id === source.droppableId);
    // const finish = datas.columns.find((e) => e.id === destination.droppableId);


    // console.log("start")
    // console.log(start);
    // console.log('finish');
    // console.log(finish);


    // if(start === finish) {
      
    //   console.log("same colonne")
    // }


    // // // if (start === finish) {
    // // //   console.log(destination.source);
    // // //   console.log(datas);

    // // //   const columnIndex = datas.findIndex(
    // // //     (e) => e.name == destination.droppableId
    // // //   );

    // // //   const newColumns = Array.from(
    // // //     datas.find((e) => e.name === source.droppableId).tasks
    // // //   );
    // // //   console.log(newColumns);

    // // //   const element = newColumns[source.index];
    // // //   newColumns.splice(source.index, 1);
    // // //   newColumns.splice(destination.index, 0, element);

    // // //   const newDatas = datas;
    // // //   newDatas[columnIndex] = {
    // // //     name: destination.droppableId,
    // // //     tasks: newColumns,
    // // //   };

    // // //   setDatas(newDatas);
    // // //   console.log(datas);
    // // // }
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
