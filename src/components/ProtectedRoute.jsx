import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, isLoading,token } = useAuth();
    console.log("🔒 ProtectedRoute Check ->", { user, token, isLoading });
    
    if (isLoading) return <div className="h-screen w-full flex items-center justify-center text-white">Cargando sesión...</div>;

    
    if (!user) {
        console.log("🚫 Acceso denegado: No hay token");
        return <Navigate to="/login" replace />;
    }

    
    return <Outlet />;
};

export default ProtectedRoute;