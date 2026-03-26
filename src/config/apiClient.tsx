import axios from 'axios';
import { clearTokens, getTokens, setTokens } from '../context/tokenStorage';

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

api.interceptors.request.use(
    async (config) => {
        const tokens = await getTokens();
        if (tokens && tokens.accessToken) {
            config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config
    },
    (error) => {
        return Promise.reject(error);
    }
)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const tokens = await getTokens();
                if (!tokens?.refreshToken) {
                    await clearTokens();
                    throw new Error("Refresh token not found. User needs to re-authenticate.");
                }

                const refreshResponse = await axios.post('http://localhost:8080/refreshToken', {
                    refreshToken: tokens.refreshToken
                });

                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;

                await setTokens(newAccessToken, newRefreshToken || tokens.refreshToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                await clearTokens();
                console.error("Session expired. Please log in again.", refreshError);
                // Instead of just rejecting, you might want to navigate the user to the login screen.
                // This would require access to the navigation container, which is not available here.
                // The application should handle API errors and navigate accordingly.
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error)
    }
)
export default api;