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
                if (!tokens || !tokens.refreshToken) {
                    throw new Error("Refresh Token Cannot Find")
                }
                const refreshResponse = await axios.post('http://localhost:8080/refreshToken', {
                    refreshToken: tokens.refreshToken
                })
                console.log(refreshResponse);

                const newAccessToken = refreshResponse.data.accessToken;
                const newRefreshToken = refreshResponse.data.refreshToken || tokens.refreshToken;

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                await setTokens(newAccessToken, newRefreshToken);
                return api(originalRequest);


            } catch (refreshError) {
                console.log("Session expired");
                await clearTokens();
                return Promise.reject(refreshError);

            }

        }
        return Promise.reject(error)
    }
)
export default api;