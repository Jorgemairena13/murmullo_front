import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
export const BASE_URL = apiUrl.replace('/api', '');

const client = axios.create({
    baseURL: apiUrl,
})

client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
});

client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const url = error.config?.url || '';
            if (!url.includes('/login') && !url.includes('/register')) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default client;