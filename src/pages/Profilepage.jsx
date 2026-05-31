import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate, Link } from "react-router-dom";
import { getUserProfile, getUserPosts, followUser, unfollowUser } from "../services/postService";
import { Skeleton } from "../components/Skeleton";
import { BASE_URL } from "../services/client";

const ProfileSkeleton = () => (
    <div className="max-w-xl mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-40 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
            </div>
        </div>
        <div className="flex justify-around mb-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col items-center gap-1">
                    <Skeleton className="h-6 w-12 rounded" />
                    <Skeleton className="h-3 w-20 rounded" />
                </div>
            ))}
        </div>
        <Skeleton className="h-4 w-3/4 rounded mb-8 mx-auto" />
        <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square" />
            ))}
        </div>
    </div>
);

export const Profile = () => {
    const { user: currentUser, isLoading } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imgErrors, setImgErrors] = useState({});
    const [following, setFollowing] = useState(false);
    const userId = id || currentUser?.id;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const userData = await getUserProfile(userId);
                setProfileUser(userData.usuario || userData);

                const postsData = await getUserPosts(userId);
                const postsArray = postsData.posts?.data || postsData.posts || postsData.data || [];
                const sorted = [...postsArray].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setPosts(sorted);
            } catch (err) {
                console.error('Error loading profile:', err);
                setError('Error al cargar el perfil');
            } finally {
                setLoading(false);
            }
        };

        if (userId && !isLoading) fetchData();
    }, [userId, isLoading]);

    const handleFollow = async () => {
        if (following) return;
        const wasFollowing = profileUser.is_following;
        setProfileUser(prev => ({
            ...prev,
            is_following: !wasFollowing,
            followers_count: wasFollowing ? prev.followers_count - 1 : prev.followers_count + 1,
        }));
        setFollowing(true);
        try {
            if (wasFollowing) {
                await unfollowUser(userId);
            } else {
                await followUser(userId);
            }
        } catch (err) {
            console.error('Follow error:', err);
            setProfileUser(prev => ({
                ...prev,
                is_following: wasFollowing,
                followers_count: wasFollowing ? prev.followers_count + 1 : prev.followers_count - 1,
            }));
        } finally {
            setFollowing(false);
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

    if (!isLoading && currentUser?.id && !id) {
        return <Navigate to={`/profile/${currentUser.id}`} replace />;
    }

    if (isLoading || loading) return <ProfileSkeleton />;

    if (error && !profileUser) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-gray-400">{error}</p>
                <button onClick={() => navigate(-1)} className="px-4 py-2 bg-purple-600 rounded-lg text-sm hover:bg-purple-500 transition-colors">
                    Volver
                </button>
            </div>
        );
    }

    if (!profileUser) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <p className="text-gray-500 font-medium">Usuario no encontrado</p>
                <button onClick={() => navigate(-1)} className="text-purple-400 hover:text-purple-300 transition-colors">
                    Volver
                </button>
            </div>
        );
    }

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
                            disabled={following}
                            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                                profileUser.is_following 
                                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            }`}
                        >
                            {following ? '...' : profileUser.is_following ? 'Siguiendo' : 'Seguir'}
                        </button>
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
                    <div className="border-t border-gray-800 pt-4 mt-2 mb-4 px-4">
                        <p className="text-gray-300 text-sm">{profileUser.bio}</p>
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
                        <Link key={post.id} to={`/post/${post.id}`} className="aspect-square bg-gray-800 block overflow-hidden group">
                            {postImgUrl && !isError ? (
                                <img 
                                    src={postImgUrl}
                                    alt="post" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={() => setImgErrors(prev => ({ ...prev, [post.id]: true }))}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                                    {post.texto?.substring(0, 20) || 'Sin texto'}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </div>
            
            {posts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-gray-800 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <p className="text-gray-500 font-medium">No hay publicaciones aún</p>
                </div>
            )}

        </div>
    );
};

export default Profile;
