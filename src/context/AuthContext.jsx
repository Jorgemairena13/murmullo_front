import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [autentificado, setIsAuthenticated] = useState(false)

    const login = (userData, token) => {
        setUser(userData)
        setToken(token)
        setIsAuthenticated(true)
        // Guardamos el token
        localStorage.setItem("token", token)
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        setIsAuthenticated(false)
        // Guardamos el token
        localStorage.removeItem("token")
    }

    useEffect(() => {
        if (token) {
            setIsAuthenticated(true)
        }
    }, [token])

    return (
        <AuthContext.Provider value={{
            user,
            token,
            autentificado,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
  return useContext(AuthContext);
};