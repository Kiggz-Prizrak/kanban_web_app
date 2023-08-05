import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "./store";
import { Provider } from "react-redux";
import Kanban from "./pages/Kanban.jsx";
import "./stylesheets/main.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      {/* <React.StrictMode> */}
        <Kanban />
      {/* </React.StrictMode> */}
    </Provider>
  </>
);
