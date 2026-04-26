import { api } from "./client";

export const authApi = {
  register: (username: string, password: string) => api.post("/auth/register", { username, password }),
  login: (username: string, password: string) => api.post("/auth/login", { username, password }),
};

export const gamesApi = {
  create: (mode: string) => api.post("/api/games", { mode }),
  list: () => api.get("/api/games"),
  get: (id: string) => api.get(`/api/games/${id}`),
  move: (id: string, san: string) => api.post(`/api/games/${id}/move`, { san }),
};

export const puzzlesApi = {
  daily: () => api.get("/api/puzzles/daily"),
  list: (difficulty?: string) => api.get("/api/puzzles", { params: { difficulty } }),
};
