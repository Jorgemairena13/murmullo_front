import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import client from "../services/client"; 

export const Profile = () => {
    const { user, logout, isLoading } = useAuth();
    const LARAVEL_URL = "http://localhost:8000";

    // Estado para guardar los datos frescos del perfil (incluyendo contadores)
    const [profileStats, setProfileStats] = useState({
        posts_count: 0,
        followers_count: 0,
        following_count: 0
    });

    // Efecto: Pedir los datos COMPLETOS del usuario (con contadores)
    useEffect(() => {
        const fetchProfileData = async () => {
            if (user?.id) {
                try {
                    
                    const { data } = await client.get(`/users/${user.id}`);
                    
                    const userData = data.usuario;

                    setProfileStats({
                        posts_count: userData.posts_count || 0,
                        followers_count: userData.followers_count || 0,
                        following_count: userData.following_count || 0
                    });

                } catch (error) {
                    console.error("Error cargando perfil completo", error);
                }
            }
        };

        fetchProfileData();
    }, [user]);

    const getAvatar = () => {
        if (!user?.avatar_url) {
            return `https://ui-avatars.com/api/?name=${user?.name}&background=random&color=fff&size=128`;
        }
        return `${LARAVEL_URL}${user.avatar_url}`;
    };

    if (isLoading) return <div className="text-white text-center mt-20">Cargando perfil...</div>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6">
            
            <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
                
                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>

                <div className="px-6 pb-6 relative">
                    {/* Avatar */}
                    <div className="relative -mt-16 mb-4">
                        <img 
                            src={getAvatar()} 
                            alt="Avatar"
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-800"
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${user?.name}&background=random&color=fff`;
                            }} 
                        />
                    </div>

                    {/* Info Usuario */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
                            <p className="text-gray-400">@{user?.email?.split('@')[0]}</p>
                            <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
                        </div>
                        
                        <button 
                            onClick={logout}
                            className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20 font-medium text-sm"
                        >
                            Cerrar Sesión
                        </button>
                    </div>

                    {/* --- ESTADÍSTICAS REALES --- */}
                    <div className="grid grid-cols-3 gap-4 mt-8 border-t border-gray-700 pt-6">
                        <div className="text-center group cursor-pointer hover:bg-gray-700/30 rounded-lg p-2 transition">
                            <span className="block text-2xl font-bold text-white group-hover:text-blue-400 transition">
                                {profileStats.posts_count}
                            </span>
                            <span className="text-sm text-gray-400">Publicaciones</span>
                        </div>
                        <div className="text-center group cursor-pointer hover:bg-gray-700/30 rounded-lg p-2 transition">
                            <span className="block text-2xl font-bold text-white group-hover:text-blue-400 transition">
                                {profileStats.followers_count}
                            </span>
                            <span className="text-sm text-gray-400">Seguidores</span>
                        </div>
                        <div className="text-center group cursor-pointer hover:bg-gray-700/30 rounded-lg p-2 transition">
                            <span className="block text-2xl font-bold text-white group-hover:text-blue-400 transition">
                                {profileStats.following_count}
                            </span>
                            <span className="text-sm text-gray-400">Siguiendo</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* DEBUG: Para ver si llegan los contadores */}
            <div className="mt-8 bg-black/50 p-4 rounded text-xs text-green-400 font-mono">
                Stats cargados: {JSON.stringify(profileStats, null, 2)}
            </div>

        </div>
    );
};