const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7007/api";

// Délai max pour les requêtes auth — évite de bloquer l'UI si le back est mort
const FETCH_TIMEOUT_MS = 5000;

const fetchWithTimeout = (url, options = {}, timeout = FETCH_TIMEOUT_MS) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  return fetch(url, { ...options, signal: controller.signal }).finally(() =>
    clearTimeout(id),
  );
};

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

export const login = async ({ email, password }) => {
  const response = await fetchWithTimeout(`${API_URL}/users/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const signup = async ({ username, email, password, avatar }) => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("email", email);
  formData.append("password", password);
  if (avatar) formData.append("avatar", avatar);

  const response = await fetchWithTimeout(`${API_URL}/users/signup`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  return handleResponse(response);
};

export const logout = async () => {
  const response = await fetchWithTimeout(`${API_URL}/users/logout`, {
    method: "POST",
    credentials: "include",
  });
  return handleResponse(response);
};

export const getAffiliatedUserBoards = async () => {
  const response = await fetch(`${API_URL}/users/boards-member`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  return handleResponse(response);
};

export const getMe = async () => {
  const response = await fetchWithTimeout(
    `${API_URL}/users/me`,
    {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    },
    3000,
  );
  return handleResponse(response);
};

const userApi = {
  login,
  signup,
  logout,
  getAffiliatedUserBoards,
  getMe,
};

export default userApi;
