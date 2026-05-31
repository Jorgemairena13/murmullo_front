import { useState, useEffect, useRef } from 'react';
import { PostCard } from '../components/PostCard';
import { CreatePostForm } from '../components/CreatePostForm';
import { getFeed, likePost, unlikePost } from '../services/postService';

export const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pullDistance, setPullDistance] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const containerRef = useRef(null);
    const touchStartY = useRef(0);

    const fetchFeed = async () => {
        try {
            setLoading(true);
            const response = await getFeed();
            console.log('Feed response:', response);
            let postsArray = [];
            if (Array.isArray(response)) {
                postsArray = response;
            } else if (response?.data) {
                postsArray = Array.isArray(response.data) ? response.data : [];
            }
            setPosts(postsArray);
            setError(null);
        } catch (err) {
            console.error('Feed error:', err);
            setError(err.response?.data?.message || 'Error al cargar el feed');
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    const handleLike = async (postId, currentlyLiked) => {
        try {
            if (currentlyLiked) {
                await unlikePost(postId);
            } else {
                await likePost(postId);
            }
            setPosts(prev => prev.map(post => 
                post.id === postId 
                    ? { 
                        ...post, 
                        is_liked: !currentlyLiked, 
                        likes_count: currentlyLiked ? post.likes_count - 1 : post.likes_count + 1 
                    }
                    : post
            ));
        } catch (err) {
            console.error('Like error:', err);
        }
    };

    const handlePostCreated = (newPost) => {
        setPosts(prev => [newPost, ...prev]);
    };

    const handleDelete = (postId) => {
        setPosts(prev => prev.filter(p => p.id !== postId));
    };

    const handleTouchStart = (e) => {
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
        const container = containerRef.current;
        if (!container || container.scrollTop > 0 || refreshing) return;
        const diff = e.touches[0].clientY - touchStartY.current;
        if (diff > 0) {
            setPullDistance(Math.min(diff * 0.4, 80));
        }
    };

    const handleTouchEnd = async () => {
        if (pullDistance > 55 && !refreshing) {
            setRefreshing(true);
            setPullDistance(0);
            try {
                const response = await getFeed();
                let postsArray = [];
                if (Array.isArray(response)) {
                    postsArray = response;
                } else if (response?.data) {
                    postsArray = Array.isArray(response.data) ? response.data : [];
                }
                setPosts(postsArray);
                setError(null);
            } catch (err) {
                console.error('Feed error:', err);
                setError(err.response?.data?.message || 'Error al cargar el feed');
            } finally {
                setRefreshing(false);
            }
        } else {
            setPullDistance(0);
        }
    };

    return (
        <div
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="max-w-xl mx-auto h-[calc(100vh-60px)] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
            <div
                style={{
                    transform: `translateY(${pullDistance}px)`,
                    transition: pullDistance === 0 ? 'transform 0.3s ease' : 'none',
                }}
            >
            {(pullDistance > 0 || refreshing) && (
                <div className="flex justify-center py-4">
                    <div className={`animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 ${refreshing ? '' : 'opacity-40'}`} />
                </div>
            )}
            <div className="sticky top-0 bg-black/80 backdrop-blur-lg z-10 border-b border-gray-800">
                <div className="px-4 py-3">
                    <h1 className="text-xl font-bold text-white">Inicio</h1>
                </div>
            </div>
            <div className="p-4">
                <CreatePostForm onPostCreated={handlePostCreated} />
            </div>

            {error && (
                <div className="mx-4 bg-red-900/30 border border-red-800/50 text-red-300 p-4 rounded-xl mb-4 text-sm">
                    {error}
                </div>
            )}
            
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
            ) : posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <p className="text-gray-500 font-medium">No hay posts todavía</p>
                    <p className="text-gray-600 text-sm mt-1">¡Sé el primero en publicar!</p>
                </div>
            ) : (
                <div className="mt-2">
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} onLike={handleLike} onDelete={handleDelete} />
                    ))}
                </div>
            )}
            </div>
        </div>
    );
};

export default FeedPage;