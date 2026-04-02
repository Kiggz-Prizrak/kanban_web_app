import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "./store";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { AuthProvider } from "./context/AuthContext";

import "./stylesheets/main.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    {/* </React.StrictMode> */}
  </Provider>,
);
