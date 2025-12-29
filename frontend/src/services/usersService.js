
import api from "../api/axios";

export const getUsers = async (params = {}) => {
  return api.get("/users", { params });
};

export const updateUserRole = async (id, data) => {
  return api.put(`/users/${id}/role`, data);
};

