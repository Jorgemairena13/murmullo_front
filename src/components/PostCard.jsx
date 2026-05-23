import { useState, useEffect } from 'react';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import { getComments } from '../services/commentService';
import { BASE_URL } from '../services/client';

export const PostCard = ({ post, onLike }) => {
    const { id, texto, imagen_url, is_liked = false, user, comments = [], comments_count = 0 } = post;
    const [showComments, setShowComments] = useState(false);
    const [postComments, setPostComments] = useState(comments);
    const [loadingComments, setLoadingComments] = useState(false);

    const handleLike = (e) => {
        e.stopPropagation();
        if (onLike) onLike(id, is_liked);
    };

    const handleCommentClick = async (e) => {
        e.stopPropagation();
        if (!showComments && postComments.length === 0 && comments_count > 0) {
            setLoadingComments(true);
            try {
                const fetchedComments = await getComments(id);
                setPostComments(Array.isArray(fetchedComments) ? fetchedComments : fetchedComments.data || []);
            } catch (err) {
                console.error('Error loading comments:', err);
            } finally {
                setLoadingComments(false);
            }
        }
        setShowComments(!showComments);
    };

    useEffect(() => {
        if (showComments && postComments.length === 0 && comments_count > 0) {
            setLoadingComments(true);
            getComments(id)
                .then(data => setPostComments(Array.isArray(data) ? data : data.data || []))
                .catch(err => console.error('Error loading comments:', err))
                .finally(() => setLoadingComments(false));
        }
    }, [showComments]);

    const handleCommentCreated = (newComment) => {
        setPostComments(prev => [newComment, ...prev]);
    };

    const handleCommentDeleted = (commentId) => {
        setPostComments(prev => prev.filter(c => c.id !== commentId));
    };

    const getImageUrl = () => {
        if (imagen_url) {
            return imagen_url.startsWith('http') ? imagen_url : `${BASE_URL}${imagen_url}`;
        }
        return 'https://via.placeholder.com/600x600/1a1a2e/4a4a6a?text=Murmullo';
    };

    return (
        <div className="bg-gray-900 border-b border-gray-800">
            <div className="w-full aspect-square bg-gray-800">
                <img 
                    src={getImageUrl()} 
                    alt="post" 
                    className="w-full h-full object-cover" 
                />
            </div>
            
            <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            user?.nombre?.charAt(0).toUpperCase() || 'U'
                        )}
                    </div>
                    <span className="font-semibold text-white text-sm">
                        {user?.nombre || 'Usuario'}
                    </span>
                    <span className="text-gray-500 text-xs">
                        @{user?.email?.split('@')[0] || 'usuario'}
                    </span>
                </div>
                
                {texto && (
                    <p className="text-white text-sm">
                        <span className="font-semibold">{user?.nombre || 'Usuario'}</span>{' '}
                        {texto}
                    </p>
                )}

                <div className="flex items-center gap-6 mt-3">
                    <button 
                        onClick={handleLike}
                        className={`transition-colors ${is_liked ? 'text-red-500' : 'text-white hover:text-red-400'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill={is_liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                    
                    <button 
                        onClick={handleCommentClick}
                        className="text-white hover:text-blue-400 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </button>
                </div>

                {postComments.length > 0 && (
                    <button 
                        onClick={() => setShowComments(!showComments)}
                        className="text-gray-400 text-sm mt-2 hover:text-white transition-colors"
                    >
                        Ver los {postComments.length} comentarios
                    </button>
                )}

                {showComments && (
                    <div className="mt-3 border-t border-gray-800 pt-3">
                        <CommentList 
                            comments={postComments} 
                            onCommentDeleted={handleCommentDeleted}
                        />
                        <CommentForm 
                            postId={id} 
                            onCommentCreated={handleCommentCreated}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};