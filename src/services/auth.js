import client from "./client";

// Login
export const login = async (credenciales) => {
    const respuesta = await client.post('/login',credenciales)
    
    return respuesta.data
}
// Registro
export const register = async (datosUsuario) => {
    const respuesta = await client.post('/register',datosUsuario)
    return respuesta.data
}

// Cerrar sesion
export const logout = async () => {
    return await client.post('/logout')
}