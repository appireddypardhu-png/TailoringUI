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

// Global response interceptor: on 403, clear auth and redirect to login
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        if (status === 403) {
            try {
                localStorage.removeItem("token");
                localStorage.removeItem("isAuthenticated");
            } catch (e) {
                // ignore localStorage errors
            }

            // user-friendly message, then redirect to login (reloads app state)
            try {
                alert("please login to continue");
            } catch (e) {
                // ignore alert errors
            }

            try {
                window.location.href = "/login";
            } catch (e) {
                // as a fallback, reload the page
                window.location.reload();
            }
        }

        return Promise.reject(error);
    }
);

export default API;