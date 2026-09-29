import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ── Token helpers ─────────────────────────────────────────────────────────────
export const tokenStorage = {
  get:    ()      => localStorage.getItem("sp_token"),
  set:    (token) => localStorage.setItem("sp_token", token),
  remove: ()      => localStorage.removeItem("sp_token"),
};

// ── Request interceptor — attach JWT on every request ─────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    if (error.response?.status === 401 || error.response?.status === 403) {
      tokenStorage.remove();
      window.location.href = "/";
    }
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (email, password) => api.post("/auth/register", { email, password }),
  login:    (email, password) => api.post("/auth/login",    { email, password }),
};

// ── Pantry Items ──────────────────────────────────────────────────────────────
export const pantryApi = {
  getAll:  ()           => api.get("/items"),
  getById: (id)         => api.get(`/items/${id}`),
  create:  (item)       => api.post("/items", item),
  update:  (id, item)   => api.put(`/items/${id}`, item),
  delete:  (id)         => api.delete(`/items/${id}`),
};

// ── Recipes ───────────────────────────────────────────────────────────────────
export const recipeApi = {
  getSuggestions: (limit = 6, offset = 0) =>
    api.get("/recipes/suggest", { params: { limit, offset } }),
  searchByQuery: (query, limit = 6, offset = 0) =>
    api.get("/recipes/search", { params: { query, limit, offset } }),
  getDetails: (id) => api.get(`/recipes/${id}/information`),
};

export default api;