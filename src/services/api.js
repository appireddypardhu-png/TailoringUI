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

// Global response interceptor: on 403, clear auth and dispatch event
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        if (status === 403) {
            try {
                localStorage.removeItem("token");
                localStorage.removeItem("isAuthenticated");
                // dispatch storage event for same-tab updates
                window.dispatchEvent(new Event("storage"));
            } catch (e) {
                // ignore errors
            }

            try {
                alert("Please login to continue.");
            } catch (e) {
                // ignore alert errors
            }
        }

        if (status === 404) {
            console.warn("API returned 404:", error?.config?.url || "unknown endpoint");
        }

        return Promise.reject(error);
    }
);

export default API;