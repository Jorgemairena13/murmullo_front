import { useState, useEffect } from 'react';
import { PostCard } from '../components/PostCard';
import { getFeed, likePost, unlikePost } from '../services/postService';

export const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    return (
        <div className="max-w-xl mx-auto h-[calc(100vh-60px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {error && (
                <div className="bg-red-900/50 border border-red-800 text-red-200 p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}
            
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    <p>No hay posts todavía.</p>
                    <p className="text-sm mt-2">¡Sé el primero en publicar!</p>
                </div>
            ) : (
                <div className="mt-2">
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} onLike={handleLike} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FeedPage;