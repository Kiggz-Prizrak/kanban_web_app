import { createBrowserRouter } from "react-router-dom";

import Root from "./Root";
import Kanban from "../pages/Kanban";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ErrorPage from "../pages/ErrorPage";
import { getAffiliatedUserBoards } from "../api/users";
import { bootstrapPromise } from "../context/AuthContext";

/**
 * Le loader attend que AuthContext ait terminé son bootstrap (getMe).
 * Ainsi un seul appel getMe est fait — celui d'AuthContext.
 * Si l'user est connecté (bootstrapPromise résout avec isAuthenticated=true),
 * on charge les boards. Sinon on retourne null (mode guest).
 *
 * On passe isAuthenticated via la promise pour éviter d'importer le store Redux
 * ou de faire un second appel réseau.
 */
const kanbanLoader = async () => {
  try {
    // Attend la fin du bootstrap AuthContext
    await bootstrapPromise;
    // Bootstrap terminé — on essaie de charger les boards
    // Si la session est valide, ça marche. Sinon 401 → null
    return await getAffiliatedUserBoards();
  } catch {
    return null;
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    // Evite le warning "No HydrateFallback element"
    HydrateFallback: () => null,
    children: [
      {
        index: true,
        element: <Kanban />,
        loader: kanbanLoader,
        HydrateFallback: () => null,
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
