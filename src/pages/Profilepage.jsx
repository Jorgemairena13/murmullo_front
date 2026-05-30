import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { getUserProfile, getUserPosts, followUser, unfollowUser } from "../services/postService";
import { deleteAccount } from "../services/userService";
import { EditProfileModal } from "../components/EditProfileModal";
import { BASE_URL } from "../services/client";

export const Profile = () => {
    const { user: currentUser, logout, updateUser, isLoading } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [imgErrors, setImgErrors] = useState({});
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
                const sorted = [...postsArray].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setPosts(sorted);
            } catch (err) {
                console.error('Error loading profile:', err);
            } finally {
                setLoading(false);
            }
        };

        if (userId && !isLoading) fetchData();
    }, [userId, isLoading]);

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

    const handleDeleteAccount = async () => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) return;
        try {
            await deleteAccount(userId);
            await logout();
            navigate('/login', { replace: true });
        } catch (err) {
            console.error('Error deleting account:', err);
            alert('Error al eliminar la cuenta. Intenta de nuevo.');
        }
    };

    const handleProfileUpdate = (updatedUserData) => {
        setProfileUser(prev => ({ ...prev, ...updatedUserData }));
        if (isOwnProfile) {
            updateUser({ ...currentUser, ...updatedUserData });
        }
    };

    const isOwnProfile = !id || id == currentUser?.id;

    const [avatarError, setAvatarError] = useState(false);

    const getAvatar = (userData) => {
        if (userData?.avatar_url) {
            return userData.avatar_url.startsWith('http') ? userData.avatar_url : `${BASE_URL}/${userData.avatar_url}`;
        }
        return null;
    };

    if (!isLoading && currentUser && !id) {
        return <Navigate to={`/profile/${currentUser.id}`} replace />;
    }

    if (isLoading || loading) return <div className="text-white text-center mt-20 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div></div>;

    if (!profileUser) return <div className="text-white text-center mt-20">Usuario no encontrado</div>;

    return (
        <div className="max-w-xl mx-auto">
            <div className="p-4">
                <div className="flex items-center gap-4 mb-6">
                    {getAvatar(profileUser) && !avatarError ? (
                        <img 
                            src={getAvatar(profileUser)} 
                            alt="Avatar"
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
                            onError={() => setAvatarError(true)}
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full border-2 border-gray-700 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold">
                            {profileUser.nombre?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    )}
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-white">{profileUser.nombre}</h1>
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
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setIsEditModalOpen(true)}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
                            >
                                Editar Perfil
                            </button>
                            <button 
                                onClick={logout}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex justify-around text-center mb-4">
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

                {profileUser.bio && (
                    <p className="text-gray-300 text-sm mb-4 px-4">{profileUser.bio}</p>
                )}

                {isOwnProfile && (
                    <div className="px-4 mb-4">
                        <button
                            onClick={handleDeleteAccount}
                            className="text-red-400 hover:text-red-300 text-sm transition-colors"
                        >
                            Eliminar cuenta
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-3 gap-1">
                {posts.map(post => {
                    const postImgUrl = post.imagen_url
                        ? (post.imagen_url.startsWith('http') ? post.imagen_url : `${BASE_URL}/${post.imagen_url}`)
                        : null;
                    const isError = imgErrors[post.id];

                    return (
                        <div key={post.id} className="aspect-square bg-gray-800">
                            {postImgUrl && !isError ? (
                                <img 
                                    src={postImgUrl}
                                    alt="post" 
                                    className="w-full h-full object-cover"
                                    onError={() => setImgErrors(prev => ({ ...prev, [post.id]: true }))}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                                    {post.texto?.substring(0, 20) || 'Sin texto'}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            {posts.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                    No hay publicaciones aún
                </div>
            )}

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={handleProfileUpdate}
            />
        </div>
    );
};

export default Profile;