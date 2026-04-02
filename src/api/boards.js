const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7007/api";

const handleResponse = async (response) => {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.error || data?.message || `HTTP error ${response.status}`,
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

// ===========================
// BOARD
// ===========================

/**
 * GET /api/boards/:boardId
 * Retourne le board complet (colonnes → tâches → sous-tâches → membres)
 */
export const getBoardById = async (boardId) => {
  const response = await fetch(`${API_URL}/boards/${boardId}`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  return handleResponse(response);
};

/**
 * POST /api/boards
 * Crée un board + ses colonnes initiales (optionnel) + membership admin
 * @param {{ title: string, columns?: string[] }} payload
 * Le back attend `title` (string) et `columns` (tableau de strings)
 */
export const createBoard = async ({ title, columns = [] }) => {
  const response = await fetch(`${API_URL}/boards`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, columns }),
  });
  return handleResponse(response);
};

/**
 * DELETE /api/boards/:boardId
 */
export const deleteBoard = async (boardId) => {
  const response = await fetch(`${API_URL}/boards/${boardId}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse(response);
};

// ===========================
// COLUMNS
// ===========================

/**
 * POST /api/boards/:boardId/new-column  (admin uniquement)
 * @param {number} boardId
 * @param {{ name: string }} payload
 */
export const addColumn = async (boardId, { name }) => {
  const response = await fetch(`${API_URL}/boards/${boardId}/new-column`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return handleResponse(response);
};

/**
 * PUT /api/boards/:boardId/column/:columnId  (admin uniquement)
 * @param {number} boardId
 * @param {number} columnId
 * @param {{ name?: string, position?: number }} payload
 */
export const updateColumn = async (boardId, columnId, payload) => {
  const response = await fetch(
    `${API_URL}/boards/${boardId}/column/${columnId}`,
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  return handleResponse(response);
};

/**
 * DELETE /api/boards/:boardId/column/:columnId  (admin uniquement)
 */
export const deleteColumn = async (boardId, columnId) => {
  const response = await fetch(
    `${API_URL}/boards/${boardId}/column/${columnId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );
  return handleResponse(response);
};

// ===========================
// TASKS
// ===========================

/**
 * POST /api/boards/:boardId/column/:columnId/new-task
 * @param {number} boardId
 * @param {number} columnId
 * @param {{ title: string, description: string, subtasks?: string[] }} payload
 */
export const addTask = async (
  boardId,
  columnId,
  { title, description, subtasks = [] },
) => {
  const response = await fetch(
    `${API_URL}/boards/${boardId}/column/${columnId}/new-task`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, subtasks }),
    },
  );
  return handleResponse(response);
};

/**
 * PUT /api/boards/:boardId/column/:columnId/task/:taskId
 * @param {number} boardId
 * @param {number} columnId
 * @param {number} taskId
 * @param {{ title?: string, description?: string, subtasks?: { id?: number, title: string, isCompleted?: boolean }[] }} payload
 */
export const updateTask = async (boardId, columnId, taskId, payload) => {
  const response = await fetch(
    `${API_URL}/boards/${boardId}/column/${columnId}/task/${taskId}`,
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  return handleResponse(response);
};

/**
 * PATCH /api/boards/:boardId/tasks/:taskId/move
 * @param {number} boardId
 * @param {number} taskId
 * @param {{
 *   sourceColumnId: number,
 *   destinationColumnId: number,
 *   destinationIndex: number
 * }} payload
 */
export const moveTask = async (
  boardId,
  taskId,
  { sourceColumnId, destinationColumnId, destinationIndex },
) => {
  const response = await fetch(
    `${API_URL}/boards/${boardId}/tasks/${taskId}/move`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceColumnId,
        destinationColumnId,
        destinationIndex,
      }),
    },
  );
  return handleResponse(response);
};

/**
 * DELETE /api/boards/:boardId/column/:columnId/task/:taskId
 */
export const deleteTask = async (boardId, columnId, taskId) => {
  const response = await fetch(
    `${API_URL}/boards/${boardId}/column/${columnId}/task/${taskId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );
  return handleResponse(response);
};

// ===========================
// MEMBERS
// ===========================

/**
 * POST /api/boards/:boardId/new-member  (admin uniquement)
 * @param {number} boardId
 * @param {{ userId: number, role?: "admin" | "member" | "viewer" }} payload
 */
export const addMember = async (boardId, payload) => {
  const response = await fetch(`${API_URL}/boards/${boardId}/new-member`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

/**
 * PUT /api/boards/:boardId/member/:memberId  (admin uniquement)
 * @param {number} memberId  ← id du UserBoard (membership), pas du User
 */
export const updateMember = async (boardId, memberId, payload) => {
  const response = await fetch(
    `${API_URL}/boards/${boardId}/member/${memberId}`,
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  return handleResponse(response);
};

/**
 * DELETE /api/boards/:boardId/member/:memberId  (admin uniquement)
 * @param {number} memberId  ← id du UserBoard
 */
export const deleteMember = async (boardId, memberId) => {
  const response = await fetch(
    `${API_URL}/boards/${boardId}/member/${memberId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );
  return handleResponse(response);
};
