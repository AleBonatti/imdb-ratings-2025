import axios from "axios";
//import { LOCAL_STORAGE_KEY } from "@/constants";

const api = axios.create({
    baseURL: "http://api.imdb-ratings.it.test/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem("auth.user");
        if (storedUser) {
            const { token } = JSON.parse(storedUser);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let onLogout: (() => void) | null = null;

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && onLogout) {
            onLogout();
        }
        return Promise.reject(error);
    }
);

export const registerLogoutHandler = (callback: () => void) => {
    onLogout = callback;
};

export default api;
