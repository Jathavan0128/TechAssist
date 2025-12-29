import api from "../api/axios";

export const getPriorities = () => api.get("/priorities");
export const createPriority = (data) => api.post("/priorities", data);
export const updatePriority = (id, data) => api.put(`/priorities/${id}`, data);
export const deletePriority = (id) => api.delete(`/priorities/${id}`);
