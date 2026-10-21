import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api/student',
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
                localStorage.setItem('student_session_expired', 'Your session has expired. Please log in again.');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
