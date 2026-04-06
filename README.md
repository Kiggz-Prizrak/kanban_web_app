# Kanban App — Frontend

Application Kanban collaborative en React. Permet de gérer des boards, colonnes, tâches et membres en temps réel via une API REST.

---

## Stack

| Outil | Rôle |
|---|---|
| React 18 | UI |
| React Router v6 | Routing + loaders |
| Redux Toolkit | State global (thème uniquement) |
| react-beautiful-dnd | Drag & drop des tâches |
| react-hook-form | Formulaires |
| SCSS | Styles |
| Vite | Bundler |

---

## Structure du projet

```
src/
├── main.jsx                    # Point d'entrée — Provider + Router
├── router/
│   ├── index.jsx               # Routes + loader protégé
│   └── Root.jsx                # Guard auth (redirect si non connecté)
├── context/
│   └── AuthContext.jsx         # Auth globale (user, login, logout, signup)
├── store/
│   ├── index.js                # Redux store
│   └── themeSlice.js           # Darkmode / lightmode
├── api/
│   ├── users.js                # Appels API /users
│   └── boards.js               # Appels API /boards
├── pages/
│   ├── Kanban.jsx              # Page principale
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   └── ErrorPage.jsx
├── components/
│   ├── Sidebar.jsx             # Liste des boards de l'user
│   ├── Header.jsx              # Titre + actions + logout
│   ├── KanbanBoard.jsx         # Chargement et affichage du board
│   ├── BoardColumn.jsx         # Colonne droppable
│   ├── TaskCard.jsx            # Tâche draggable
│   ├── DarkmodeButton.jsx
│   ├── UserSearcher.jsx        # Recherche paginée d'users (debounce + AbortController)
│   └── modal/
│       ├── board/
│       │   ├── AddBoard.jsx
│       │   ├── EditBoard.jsx
│       │   └── DeleteBoard.jsx
│       ├── columns/
│       │   └── AddColums.jsx
│       ├── tasks/
│       │   ├── AddTask.jsx
│       │   ├── DeleteTask.jsx
│       │   ├── TaskDetailsModal.jsx
│       │   └── TaskEditor.jsx
│       └── members/
│           └── MembersModal.jsx
└── stylesheets/
    ├── main.scss
    ├── abstracts/
    │   ├── variables.scss      # Palette + layout
    │   └── mixins.scss         # Flexbox, typographie, boutons
    ├── base/
    │   ├── base.scss
    │   └── fonts.scss
    ├── components/
    │   ├── modal.scss
    │   ├── members.scss        # Modal membres + UserSearcher
    │   ├── header.scss
    │   ├── sidebar.scss
    │   ├── boardColumn.scss
    │   ├── boardTask.scss
    │   ├── kanbanBoard.scss
    │   ├── boardContainer.scss
    │   ├── buttons.scss
    │   └── darkmodeButton.scss
    ├── layout/
    │   └── body.scss
    └── pages/
        └── kanban.scss
```

---

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

---

## Variables d'environnement

```env
VITE_API_URL=http://localhost:7007/api
```

---

## Authentification

Gérée via `AuthContext`. Le cookie HTTP-only `kanban_access_token` est posé par le back après login/signup — pas de manipulation de token côté front.

Au démarrage de l'app (`isBootstrapping`), `getMe()` est appelé pour vérifier si une session est active. Pendant ce temps, rien ne s'affiche (évite le flash de contenu non-authentifié).

Le loader React Router de la route `/` appelle `getAffiliatedUserBoards()`. Si la réponse est 401, il fait un `redirect("/login")` natif — le composant ne monte jamais.

```
main.jsx
└── Provider (Redux)
    └── AuthProvider
        └── RouterProvider
            └── Root (guard — redirect /login si non connecté)
                ├── / → Kanban (loader: getAffiliatedUserBoards)
                ├── /login → LoginPage
                └── /signup → SignupPage
```

---

## Architecture des données

Les données du board (colonnes, tâches, sous-tâches) ne passent **pas** par Redux. Elles sont fetchées directement via `getBoardById()` dans `KanbanBoard` et stockées dans un state local. Redux ne gère que le thème.

```
Redux store
└── theme.currentTheme  ("darkmode" | "lightmode")

KanbanBoard (state local)
└── board
    └── columns[]
        └── tasks[]
            └── substasks[]
```

### Pattern de rafraîchissement

`KanbanBoard` expose `fetchBoard` via `useImperativeHandle`. Après chaque mutation (ajout, modification, suppression), les modals appellent `onBoardRefresh()` qui déclenche un nouveau fetch depuis le serveur.

```
Kanban
├── kanbanBoardRef → KanbanBoard.fetchBoard()
└── handleBoardRefresh → passé à tous les modals via onBoardRefresh
```

---

## Drag & drop

Géré par `react-beautiful-dnd` dans `KanbanBoard`. La mise à jour est **optimiste** : l'UI bouge immédiatement, puis `moveTask()` est appelé en arrière-plan. En cas d'erreur API, le board est rechargé depuis le serveur.

```
onDragEnd
├── Mise à jour optimiste du state local (setBoard)
└── moveTask(boardId, taskId, { sourceColumnId, destinationColumnId, destinationIndex })
    ├── Succès → rien (le state local est déjà à jour)
    └── Erreur → fetchBoard() (rollback via le serveur)
```

---

## Gestion des rôles

Le rôle de l'utilisateur courant sur le board est lu depuis `userBoards` (retourné par le loader) :

```js
const isAdmin = currentMembership?.role === "admin"
```

`isAdmin` est passé à `Header`, `KanbanBoard`, `BoardColumn`, `TaskCard` et `MembersModal` pour conditionner l'affichage des actions (ajout de colonne, suppression de tâche, gestion des membres).

| Action | admin | member | viewer |
|---|---|---|---|
| Voir le board | ✓ | ✓ | ✓ |
| Créer/déplacer une tâche | ✓ | ✓ | ✗ |
| Supprimer une tâche | ✓ | ✗ | ✗ |
| Ajouter/modifier/supprimer une colonne | ✓ | ✗ | ✗ |
| Gérer les membres | ✓ | ✗ | ✗ |
| Supprimer le board | ✓ | ✗ | ✗ |

---

## UserSearcher

Composant de recherche d'utilisateurs utilisé dans `MembersModal`. Appelle `GET /api/users/search` avec debounce (350ms) et `AbortController` pour annuler les requêtes en vol.

```
UserSearcher
├── useUserSearch (hook interne)
│   ├── debounce 350ms
│   ├── AbortController (annule la requête précédente)
│   └── filtre côté client les excludeIds (membres déjà présents)
├── HighlightedText — highlight JSX pur (pas de dangerouslySetInnerHTML)
└── Pagination serveur (fenêtre glissante ±2 pages)
```

---

## Thème

Deux thèmes : `darkmode` (défaut) et `lightmode`. Chaque composant applique un modifier CSS `--${theme}` sur ses classes. Le thème est persisté dans Redux (pas de `redux-persist` — réinitialisé au rechargement).

---

## Sécurités notables côté front

- `dangerouslySetInnerHTML` absent — le highlight de recherche est rendu en JSX pur via `String.split(regex)` 
- `escapeRegex()` sur tous les termes de recherche avant construction du `RegExp` — prévention ReDoS
- `maxLength={100}` sur les inputs de recherche
- `AbortController` sur les requêtes de recherche — pas de race condition
- Les cookies JWT sont `httpOnly` — inaccessibles au JS