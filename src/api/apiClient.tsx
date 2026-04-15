import type { AxiosInstance } from "axios";
import axios from "axios";
import { store } from "../redux/store";
import {
    logout,
    setAccessToken
} from "../redux/slice/authSlice";
const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 100000,
    withCredentials: true
});
const refreshClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
});

apiClient.interceptors.request.use((config) => {
    const accessToken = store.getState().auth.accessToken;

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (
    error: any,
    token: string | null = null
) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization =
                            `Bearer ${token}`;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await refreshClient.post(
                    "/auth/refresh_token"
                );

                const newToken = res.data.access_token;

                store.dispatch(setAccessToken(newToken));

                processQueue(null, newToken);

                originalRequest.headers.Authorization =
                    `Bearer ${newToken}`;

                return apiClient(originalRequest);
            } catch (err) {
                processQueue(err, null);

                store.dispatch(logout());
                window.location.replace("/dang-nhap");
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;