import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost, likePost, unlikePost } from '../services/postService';
import { CommentForm } from '../components/CommentForm';
import { CommentList } from '../components/CommentList';
import { getComments } from '../services/commentService';
import { BASE_URL } from '../services/client';

export const PostPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await getPost(postId);
                setPost(data.post || data.data || data);
            } catch (err) {
                console.error('Error loading post:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    const handleLike = async () => {
        if (!post) return;
        try {
            if (post.is_liked) {
                await unlikePost(postId);
                setPost(prev => ({ ...prev, is_liked: false, likes_count: prev.likes_count - 1 }));
            } else {
                await likePost(postId);
                setPost(prev => ({ ...prev, is_liked: true, likes_count: prev.likes_count + 1 }));
            }
        } catch (err) {
            console.error('Like error:', err);
        }
    };

    useEffect(() => {
        if (showComments && comments.length === 0) {
            const loadComments = async () => {
                try {
                    const data = await getComments(postId);
                    setComments(Array.isArray(data) ? data : data.data || []);
                } catch (err) {
                    console.error('Error loading comments:', err);
                }
            };
            loadComments();
        }
    }, [showComments, postId]);

    const handleCommentCreated = (newComment) => {
        setComments(prev => [newComment, ...prev]);
        setPost(prev => ({ ...prev, comentarios_count: (prev.comentarios_count || 0) + 1 }));
    };

    const handleCommentDeleted = (commentId) => {
        setComments(prev => prev.filter(c => c.id !== commentId));
        setPost(prev => ({ ...prev, comentarios_count: Math.max(0, (prev.comentarios_count || 0) - 1) }));
    };

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

    if (!post) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
                <p className="text-gray-400">Post no encontrado</p>
                <button onClick={() => navigate(-1)} className="text-purple-400 hover:text-purple-300">
                    Volver
                </button>
            </div>
        );
    }

    const imageUrl = getImageUrl(post.imagen_url);
    const userAvatarUrl = post.user?.avatar_url
        ? (post.user.avatar_url.startsWith('http') ? post.user.avatar_url : `${BASE_URL}${post.user.avatar_url}`)
        : null;

    return (
        <div className="h-screen bg-black flex flex-col lg:flex-row">
            <div className="flex-1 flex items-center justify-center bg-black min-h-0 relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 z-10 text-white hover:text-gray-300 transition-colors p-2 rounded-full bg-black/50 hover:bg-black/70"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="post"
                        className="max-w-full max-h-full object-contain"
                    />
                ) : (
                    <div className="text-gray-500 text-lg px-8 text-center">
                        {post.texto || 'Sin contenido'}
                    </div>
                )}
            </div>

            <div className="w-full lg:w-[420px] bg-gray-900 border-l border-gray-800 flex flex-col h-full">
                <div className="p-4 border-b border-gray-800 flex items-center gap-3">
                    <Link to={`/profile/${post.user?.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        {userAvatarUrl ? (
                            <img src={userAvatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                                {post.user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        )}
                        <div>
                            <p className="text-white font-semibold text-sm">{post.user?.nombre || 'Usuario'}</p>
                            <p className="text-gray-500 text-xs">@{post.user?.username || 'usuario'}</p>
                        </div>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {post.texto && (
                        <div className="p-4 border-b border-gray-800">
                            <p className="text-white text-sm">{post.texto}</p>
                        </div>
                    )}

                    <div className="p-4 border-b border-gray-800">
                        <div className="flex items-center gap-6">
                            <button onClick={handleLike} className="flex items-center gap-2 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24"
                                    fill={post.is_liked ? "currentColor" : "none"}
                                    stroke="currentColor" strokeWidth="2"
                                    color={post.is_liked ? "#ef4444" : "currentColor"}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="text-white text-sm">{post.likes_count || 0}</span>
                            </button>
                            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="text-white text-sm">{post.comentarios_count || 0}</span>
                            </button>
                        </div>
                    </div>

                    {showComments && (
                        <div className="p-4">
                            <CommentForm postId={postId} onCommentCreated={handleCommentCreated} />
                            <CommentList comments={comments} onCommentDeleted={handleCommentDeleted} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostPage;
