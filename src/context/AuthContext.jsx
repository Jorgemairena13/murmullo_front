import { createContext, useState, useContext, useEffect, useRef } from "react";
import client from "../services/client";
import { logout as logoutRequest } from "../services/auth";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [autentificado, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true);
    const tokenRef = useRef(token);

    useEffect(() => {
        tokenRef.current = token;
    }, [token]);

    const login = (userData, token) => {
        setUser(userData)
        setToken(token)
        setIsAuthenticated(true)
        localStorage.setItem("token", token)
    }

    const updateUser = (userData) => {
        setUser(userData)
    }

    const logout = async () => {
        try {
            await logoutRequest();
        } catch (error) {
            console.error('Error al cerrar sesión en el servidor:', error);
        }
        setUser(null)
        setToken(null)
        setIsAuthenticated(false)
        localStorage.removeItem("token")
    }

    useEffect(() => {
        async function checkAuth() {
            if (!tokenRef.current) {
                setIsAuthenticated(false)
                setLoading(false)
                return
            }
            try {
                const { data } = await client.get('/user')
                setUser(data)
                setIsAuthenticated(true)
            } catch (error) {
                console.error('Token invalidado o error al obtener el usuario:', error)
                logout()
            } finally {
                setLoading(false);
            }
        }
        checkAuth()
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            token,
            autentificado,
            login,
            logout,
            updateUser,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
};