import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchUsers, followUser, unfollowUser } from '../services/postService';
import { Skeleton } from '../components/Skeleton';
import { BASE_URL } from '../services/client';

const UserSkeleton = () => (
    <div className="flex items-center gap-4 p-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
        </div>
        <Skeleton className="w-20 h-8 rounded-full" />
    </div>
);

export const Busqueda = () => {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [followStates, setFollowStates] = useState({});

    useEffect(() => {
        const search = async () => {
            if (!query.trim()) {
                setUsers([]);
                setError(null);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const data = await searchUsers(query);
                const usersList = data.users || data || [];
                setUsers(usersList);
                const state = {};
                usersList.forEach(u => {
                    state[u.id] = u.is_following ? 'following' : u.has_pending_request ? 'pending' : null;
                });
                setFollowStates(state);
            } catch (err) {
                console.error('Search error:', err);
                setError('Error al buscar usuarios');
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(search, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleFollow = async (userId) => {
        const currentState = followStates[userId];
        const previous = { ...followStates };
        const isUnfollow = currentState === 'following' || currentState === 'pending';
        setFollowStates(prev => ({ ...prev, [userId]: isUnfollow ? null : 'following' }));
        try {
            if (isUnfollow) {
                await unfollowUser(userId);
            } else {
                const response = await followUser(userId);
                if (response.follow_request) {
                    setFollowStates(prev => ({ ...prev, [userId]: 'pending' }));
                }
            }
        } catch (err) {
            console.error('Follow error:', err);
            setFollowStates(previous);
        }
    };

    return (
        <div className="h-[calc(100vh-72px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="sticky top-0 bg-black/80 backdrop-blur-lg z-10 border-b border-gray-800">
                <div className="px-4 py-3">
                    <h1 className="text-xl font-bold text-white">Buscar</h1>
                </div>
            </div>
            <div className="p-4">
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar usuarios..."
                        className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {error && (
                <div className="mx-4 bg-red-900/30 border border-red-800/50 text-red-300 p-4 rounded-xl mb-4 text-sm flex items-center gap-3">
                    <span className="flex-1">{error}</span>
                    <button
                        onClick={() => setQuery(prev => prev + ' ')}
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors shrink-0"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {loading && (
                <div className="divide-y divide-gray-800">
                    {[1, 2, 3].map(i => <UserSkeleton key={i} />)}
                </div>
            )}

            {!loading && !error && query && users.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-gray-500 font-medium">No se encontraron resultados</p>
                    <p className="text-gray-600 text-sm">Prueba con otro término de búsqueda</p>
                </div>
            )}

            {!loading && users.length > 0 && (
                <div className="divide-y divide-gray-800">
                    {users.map(user => {
                        const state = followStates[user.id];
                        return (
                            <div key={user.id} className="flex items-center gap-4 p-4 hover:bg-gray-800/50 transition-colors">
                                <Link to={`/profile/${user.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shrink-0">
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url.startsWith('http') ? user.avatar_url : `${BASE_URL}${user.avatar_url}`} alt={user.nombre} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            user.nombre?.charAt(0).toUpperCase() || 'U'
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white font-semibold text-sm truncate">{user.nombre}</p>
                                        <p className="text-gray-500 text-sm truncate">@{user.username}</p>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => handleFollow(user.id)}
                                    className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                        state === 'following'
                                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                                            : state === 'pending'
                                                ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/50 hover:bg-yellow-600/30'
                                                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                                    }`}
                                >
                                    {state === 'following' ? 'Siguiendo' : state === 'pending' ? 'Solicitud enviada' : 'Seguir'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {!query && !error && (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-gray-500">Busca usuarios por nombre o @username</p>
                </div>
            )}
        </div>
    );
};

export default Busqueda;
