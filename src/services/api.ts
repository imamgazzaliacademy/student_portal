import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api/api/student',
});

apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('studentToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (typeof window !== 'undefined' && error.response?.status === 401) {
            // If session expired and user is not on login page, redirect
            if (!window.location.pathname.includes('/login')) {
                localStorage.removeItem('studentToken');
                localStorage.removeItem('studentData');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
