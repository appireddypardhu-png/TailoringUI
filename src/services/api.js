import axios from "axios";

const API = axios.create({
    baseURL: "https://tailoring-management-system-l6v1.onrender.com"
});

// Automatically attach JWT token
API.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default API;