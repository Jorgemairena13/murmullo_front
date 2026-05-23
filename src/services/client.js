import axios from 'axios'
// Base de la URL
const apiUrl = 'http://localhost:8000/api';

// Configuracion de axios 
const client = axios.create({
    baseURL: apiUrl,
    
})

// Interceptar token
client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
});

export default client;