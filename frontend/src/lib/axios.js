import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
    || (import.meta.env.DEV
        ? "http://localhost:3000/api"
        : "https://chatify-production-e698.up.railway.app/api");

export const axiosInstance = axios.create({
        baseURL : API_BASE_URL,
})

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});