import API from "../api/axios";

export const loginUser = async (email, password) => {
  const { data } = await API.post("/auth/login", { email, password });
  return data;
};

export const registerUser = async (payload) => {
  const { data } = await API.post("/auth/register", payload);
  return data;
};
