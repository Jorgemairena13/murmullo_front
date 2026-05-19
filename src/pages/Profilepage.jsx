import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile, getUserPosts, followUser, unfollowUser } from "../services/postService";

export const Profile = () => {
    const { user: currentUser, logout, isLoading } = useAuth();
    const { id } = useParams();
    const LARAVEL_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:8000";

    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = id || currentUser?.id;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const userData = await getUserProfile(userId);
                console.log('User profile:', userData);
                setProfileUser(userData.usuario || userData);
                
                const postsData = await getUserPosts(userId);
                console.log('User posts:', postsData);
                const postsArray = postsData.posts?.data || postsData.posts || postsData.data || [];
                setPosts(postsArray);
            } catch (err) {
                console.error('Error loading profile:', err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchData();
    }, [userId]);

    const handleFollow = async () => {
        try {
            if (profileUser.is_following) {
                await unfollowUser(userId);
                setProfileUser(prev => ({ ...prev, is_following: false, followers_count: prev.followers_count - 1 }));
            } else {
                await followUser(userId);
                setProfileUser(prev => ({ ...prev, is_following: true, followers_count: prev.followers_count + 1 }));
            }
        } catch (err) {
            console.error('Follow error:', err);
        }
    };

    const isOwnProfile = !id || id == currentUser?.id;

    const getAvatar = (userData) => {
        if (userData?.avatar_url) {
            return userData.avatar_url.startsWith('http') ? userData.avatar_url : `${LARAVEL_URL}${userData.avatar_url}`;
        }
        return `https://ui-avatars.com/api/?name=${userData?.name || 'U'}&background=random&color=fff&size=128`;
    };

    if (isLoading || loading) return <div className="text-white text-center mt-20 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div></div>;

    if (!profileUser) return <div className="text-white text-center mt-20">Usuario no encontrado</div>;

    return (
        <div className="max-w-xl mx-auto">
            <div className="p-4">
                <div className="flex items-center gap-4 mb-6">
                    <img 
                        src={getAvatar(profileUser)} 
                        alt="Avatar"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
                    />
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-white">{profileUser.name}</h1>
                        <p className="text-gray-400">@{profileUser.username}</p>
                    </div>
                    
                    {!isOwnProfile && (
                        <button 
                            onClick={handleFollow}
                            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                                profileUser.is_following 
                                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            }`}
                        >
                            {profileUser.is_following ? 'Siguiendo' : 'Seguir'}
                        </button>
                    )}
                    
                    {isOwnProfile && (
                        <button 
                            onClick={logout}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600"
                        >
                            Cerrar Sesión
                        </button>
                    )}
                </div>

                <div className="flex justify-around text-center mb-6">
                    <div>
                        <span className="block text-xl font-bold text-white">{posts.length}</span>
                        <span className="text-sm text-gray-400">Publicaciones</span>
                    </div>
                    <div>
                        <span className="block text-xl font-bold text-white">{profileUser.followers_count || 0}</span>
                        <span className="text-sm text-gray-400">Seguidores</span>
                    </div>
                    <div>
                        <span className="block text-xl font-bold text-white">{profileUser.following_count || 0}</span>
                        <span className="text-sm text-gray-400">Siguiendo</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-1">
                {posts.map(post => (
                    <div key={post.id} className="aspect-square bg-gray-800">
                        {post.imagen ? (
                            <img 
                                src={post.imagen.startsWith('http') ? post.imagen : `${LARAVEL_URL}${post.imagen}`}
                                alt="post" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                                {post.texto?.substring(0, 20)}...
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            {posts.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                    No hay publicaciones aún
                </div>
            )}
        </div>
    );
};

export default Profile;