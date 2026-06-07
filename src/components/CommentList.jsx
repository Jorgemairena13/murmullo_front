import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { deleteComment } from '../services/commentService';
import { ConfirmModal } from './ConfirmModal';
import { Avatar } from './Avatar';

export const CommentList = ({ comments, onCommentDeleted }) => {
    const { user: currentUser } = useAuth();
    const [confirmId, setConfirmId] = useState(null);

    const handleDelete = async (commentId, e) => {
        e.preventDefault();
        e.stopPropagation();
        setConfirmId(commentId);
    };

    const confirmDelete = async () => {
        if (!confirmId) return;
        const commentId = confirmId;
        setConfirmId(null);

        try {
            await deleteComment(commentId);
            if (onCommentDeleted) {
                onCommentDeleted(commentId);
            }
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    if (!comments || comments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                </svg>
                <p className="text-gray-500 text-sm">No hay comentarios todavía</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-2 mt-2">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-2 text-sm">
                        <Avatar src={comment.user?.avatar_url} name={comment.user?.nombre} size={6} />
                        <div className="flex-1 min-w-0">
                            <span className="font-semibold text-white text-xs">
                                {comment.user?.username || 'usuario'}
                            </span>
                            <span className="text-gray-300 ml-1 break-words">
                                {comment.texto}
                            </span>
                        </div>
                        {currentUser?.id === comment.user_id && (
                            <button
                                onClick={(e) => handleDelete(comment.id, e)}
                                className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <ConfirmModal
                isOpen={!!confirmId}
                onConfirm={confirmDelete}
                onCancel={() => setConfirmId(null)}
                title="Eliminar comentario"
                message="¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer."
                confirmText="Eliminar"
            />
        </>
    );
};