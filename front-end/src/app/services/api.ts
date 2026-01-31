import axios from 'axios';

// Ensure this matches your running backend port
const API_URL = 'http://localhost:5001/api/v1';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: Handle Token Refresh (Simple version)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error('No refresh token');

                const { data } = await axios.post(`${API_URL}/auth/refresh-tokens`, {
                    refreshToken,
                });

                const { access, refresh } = data.data.tokens;

                localStorage.setItem('accessToken', access.token);
                localStorage.setItem('refreshToken', refresh.token);

                originalRequest.headers.Authorization = `Bearer ${access.token}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Logout if refresh fails
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
