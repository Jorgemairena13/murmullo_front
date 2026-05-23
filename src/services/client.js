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

export default client;