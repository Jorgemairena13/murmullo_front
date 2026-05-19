import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchUsers } from '../services/postService';

export const Busqueda = () => {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const search = async () => {
            if (!query.trim()) {
                setUsers([]);
                return;
            }
            setLoading(true);
            try {
                const data = await searchUsers(query);
                setUsers(data.users || data || []);
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(search, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    return (
        <div className="h-[calc(100vh-60px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="p-4">
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar"
                        className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {loading && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                </div>
            )}

            {!loading && query && users.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                    No se encontraron resultados
                </div>
            )}

            {!loading && users.length > 0 && (
                <div className="divide-y divide-gray-800">
                    {users.map(user => (
                        <Link 
                            to={`/profile/${user.id}`} 
                            key={user.id}
                            className="flex items-center gap-4 p-4 hover:bg-gray-800/50 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    user.name?.charAt(0).toUpperCase() || 'U'
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-semibold text-sm">{user.name}</p>
                                <p className="text-gray-500 text-sm">@{user.username}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {!query && (
                <div className="text-center text-gray-500 py-8">
                    <p className="text-sm">Busca usuarios por nombre o @username</p>
                </div>
            )}
        </div>
    );
};

export default Busqueda;