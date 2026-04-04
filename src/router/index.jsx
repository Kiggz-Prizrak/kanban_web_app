import { createBrowserRouter, redirect } from "react-router-dom";

import Root from "./Root";
import Kanban from "../pages/Kanban";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ErrorPage from "../pages/ErrorPage";
import { getAffiliatedUserBoards } from "../api/users";

const protectedLoader = async () => {
  try {
    const userBoards = await getAffiliatedUserBoards();
    return userBoards;
  } catch (err) {
    if (err.status === 401) {
      return redirect("/login");
    }
    throw err;
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Kanban />,
        loader: protectedLoader,
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
