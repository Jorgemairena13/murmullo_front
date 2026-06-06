import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-black gap-4">
            <div className="h-10 w-10 rounded-full border-2 border-gray-700 border-t-purple-500 animate-spin" />
            <p className="text-gray-400 text-sm">Cargando sesión...</p>
        </div>
    );

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;