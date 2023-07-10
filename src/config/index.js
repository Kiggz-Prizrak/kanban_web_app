const initialData = {
  tasks: [],
  columns: [
     {
      id: "TODO",
      title: "Tâches à faire",
      taskIds: [],
    },
     {
      id: "DOING",
      title: "Tâches en cours",
      taskIds: [],
    },
    {
      id: "DONE",
      title: "Tâches terminée",
      taskIds: [],
    
  }
  ],
  columnOrder: ["TODO", "DOING", "DONE"],
};

export default initialData;
