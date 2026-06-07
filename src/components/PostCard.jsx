import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './Avatar';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import { ConfirmModal } from './ConfirmModal';
import { getComments } from '../services/commentService';
import { deletePost } from '../services/postService';
import { BASE_URL } from '../services/client';

export const PostCard = ({ post, onLike, onDelete, onDeleteError }) => {
    const { user: currentUser } = useAuth();
    const { id, texto, imagen_url, is_liked = false, user, comments = [], comments_count = 0, likes_count = 0 } = post;
    const [showComments, setShowComments] = useState(false);
    const [postComments, setPostComments] = useState(comments);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const isOwner = currentUser?.id === user?.id;

    const handleLike = (e) => {
        e.stopPropagation();
        if (onLike) onLike(id, is_liked);
    };

    const handleCommentClick = (e) => {
        e.stopPropagation();
        setShowComments(prev => !prev);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (deleting) return;
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        setShowConfirm(false);
        setDeleting(true);
        try {
            await deletePost(id);
            if (onDelete) onDelete(id);
        } catch (err) {
            console.error('Error deleting post:', err);
            setDeleteError('Error al eliminar');
            if (onDeleteError) onDeleteError('Error al eliminar el post');
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        if (showComments && postComments.length === 0 && comments_count > 0) {
            getComments(id)
                .then(data => setPostComments(Array.isArray(data) ? data : data.data || []))
                .catch(err => console.error('Error loading comments:', err));
        }
    }, [showComments, id, comments_count]);

    const handleCommentCreated = (newComment) => {
        setPostComments(prev => [newComment, ...prev]);
    };

    const handleCommentDeleted = (commentId) => {
        setPostComments(prev => prev.filter(c => c.id !== commentId));
    };

    const [imgError, setImgError] = useState(false);

    const getImageUrl = () => {
        if (imagen_url) {
            return imagen_url.startsWith('http') ? imagen_url : `${BASE_URL}/${imagen_url}`;
        }
        return null;
    };

    const imageUrl = getImageUrl();

    return (
        <div className="bg-gray-900 border-b border-gray-800 active:scale-[0.98] transition-transform duration-150">
            {imageUrl && !imgError ? (
                <div className="w-full bg-gray-800 flex items-center justify-center">
                    <img 
                        src={imageUrl} 
                        alt="post" 
                        className="w-full max-h-[560px] object-contain"
                        onError={() => setImgError(true)}
                    />
                </div>
            ) : (
                <div className="w-full h-32 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    {texto ? (
                        <p className="text-gray-600 text-xs px-4 text-center line-clamp-3">{texto}</p>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    )}
                </div>
            )}
            
            <div className="p-3 pt-2">
                <div className="flex items-center gap-2 mb-2">
                    <Link to={`/profile/${user?.id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Avatar src={user?.avatar_url} name={user?.nombre} size={8} />
                        <span className="font-semibold text-white text-sm">
                            {user?.nombre || 'Usuario'}
                        </span>
                        <span className="text-gray-500 text-xs">
                            @{user?.username || 'usuario'}
                        </span>
                    </Link>

                    {isOwner && (
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="ml-auto text-gray-500 hover:text-red-400 transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
                
                {texto && (
                    <p className="text-white text-sm mb-2">
                        <span className="font-semibold">{user?.nombre || 'Usuario'}</span>{' '}
                        {texto}
                    </p>
                )}

                <div className="flex items-center gap-4 mb-1">
                    <div className="flex items-center gap-1.5">
                        <button 
                            onClick={handleLike}
                            className={`transition-all duration-150 active:scale-75 ${is_liked ? 'text-red-500' : 'text-white hover:text-red-400'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill={is_liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                        <span className="text-sm font-medium text-white">{likes_count}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button 
                            onClick={handleCommentClick}
                            className="text-white hover:text-purple-400 transition-all duration-150 active:scale-75"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </button>
                        <span className="text-sm font-medium text-white">{comments_count}</span>
                    </div>
                </div>

                {deleteError && (
                    <p className="text-red-400 text-xs mt-1">{deleteError}</p>
                )}

                {postComments.length > 0 && (
                    <button 
                        onClick={() => setShowComments(!showComments)}
                        className="text-purple-400 text-sm mt-2 hover:text-purple-300 transition-colors"
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
            <ConfirmModal
                isOpen={showConfirm}
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirm(false)}
                title="Eliminar post"
                message="¿Estás seguro de que quieres eliminar este post? Esta acción no se puede deshacer."
            />
        </div>
    );
};
