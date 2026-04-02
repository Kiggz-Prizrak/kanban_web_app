import { createBrowserRouter } from "react-router-dom";

import Root from "./Root";

import Kanban from "../pages/Kanban";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ErrorPage from "../pages/ErrorPage";
import { getAffiliatedUserBoards } from "../api/users";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Kanban />,
        loader: () => getAffiliatedUserBoards(),
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
    ],
  },
]);

export default router;
