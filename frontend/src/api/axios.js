import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// automatically attach token
api.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    const token = user?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
