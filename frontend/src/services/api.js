import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,

    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export const registerUser = (data) => api.post("/auth/register", data);

export const loginUser = (data) => api.post("/auth/login", data);

export const getTasks = (params) => api.get("/tasks/", { params });

export const getTask = (id) => api.get(`/tasks/${id}`);

export const createTask = (data) => api.post("/tasks/", data);

export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);

export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export const toggleTaskComplete = (id) => api.patch(`/tasks/${id}/complete`);

export const reorderTasks = (taskIds) =>
    api.patch("/tasks/reorder", { task_ids: taskIds });

export const getCategories = () => api.get("/categories/");

export const createCategory = (data) => api.post("/categories/", data);

export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export default api;
