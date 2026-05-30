import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getExplorarPosts } from '../services/postService';
import { BASE_URL } from '../services/client';

export const ExplorarPage = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);
    const [imgErrors, setImgErrors] = useState({});

    const sentinelRef = useRef(null);

    const fetchPosts = useCallback(async (pageNum) => {
        if (pageNum === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        try {
            const data = await getExplorarPosts(pageNum);
            const newPosts = data.data || data.posts?.data || data;
            setPosts(prev => pageNum === 1 ? newPosts : [...prev, ...newPosts]);
            setHasMore(!!data.next_page_url);
            setError(null);
        } catch (err) {
            console.error('Explorar error:', err);
            setError('Error al cargar');
            setHasMore(false);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setInitialLoad(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts(1);
    }, [fetchPosts]);

    useEffect(() => {
        if (!sentinelRef.current || initialLoad) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [hasMore, loadingMore, loading, initialLoad]);

    useEffect(() => {
        if (page > 1) {
            fetchPosts(page);
        }
    }, [page, fetchPosts]);

    const getImageUrl = (url) => {
        if (!url) return null;
        return url.startsWith('http') ? url : `${BASE_URL}/${url}`;
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
            </div>
        );
    }

    if (error && posts.length === 0) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
                <p className="text-gray-400">{error}</p>
                <button onClick={() => { setPage(1); setInitialLoad(true); fetchPosts(1); }}
                    className="px-4 py-2 bg-purple-600 rounded-lg text-sm hover:bg-purple-500 transition-colors">
                    Reintentar
                </button>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="h-screen flex items-center justify-center bg-black">
                <p className="text-gray-500">No hay publicaciones de cuentas públicas aún</p>
            </div>
        );
    }

    return (
        <div className="h-screen overflow-y-auto bg-black [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="p-4">
                <h1 className="text-xl font-bold text-white mb-4">Explorar</h1>
                <div className="grid grid-cols-3 gap-1">
                    {posts.map(post => {
                        const imageUrl = getImageUrl(post.imagen_url);
                        const hasError = imgErrors[post.id];
                        return (
                            <Link
                                key={post.id}
                                to={`/post/${post.id}`}
                                className="aspect-square bg-gray-800 overflow-hidden group relative"
                            >
                                {imageUrl && !hasError ? (
                                    <img
                                        src={imageUrl}
                                        alt=""
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={() => setImgErrors(prev => ({ ...prev, [post.id]: true }))}
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs p-2 text-center break-words">
                                        {post.texto?.substring(0, 30) || 'Sin imagen'}
                                    </div>
                                )}
                                {post.texto && imageUrl && !hasError && (
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div ref={sentinelRef} className="h-10 flex items-center justify-center">
                    {loadingMore && (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500" />
                    )}
                    {!hasMore && posts.length > 0 && (
                        <p className="text-gray-600 text-sm py-4">Ya no hay más publicaciones</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExplorarPage;
