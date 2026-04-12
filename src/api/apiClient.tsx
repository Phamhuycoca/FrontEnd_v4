import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '../utils/LocalStore';

const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 100000,
});

// Thêm access token vào mỗi request
apiClient.interceptors.request.use((config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});
// Quản lý refresh token
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Xử lý response
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // Nếu token hết hạn
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/refresh_token`, {
                    refresh_token: getRefreshToken(),
                });
                const newToken = res.data.access_token;
                const newRefreshToken = res.data.refresh_token;
                setTokens(newToken, newRefreshToken);
                apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
                processQueue(null, newToken);
                return apiClient(originalRequest); // retry request cũ
            } catch (err) {
                processQueue(err, null);
                clearTokens();
                //window.location.href = '/login'; // logout
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export default apiClient;
