import { useAuth } from '../context/AuthContext';
import { deleteComment } from '../services/commentService';
import { BASE_URL } from '../services/client';

export const CommentList = ({ comments, onCommentDeleted }) => {
    const { user: currentUser } = useAuth();

    const handleDelete = async (commentId, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('¿Eliminar comentario?')) return;

        try {
            console.log('🗑️ Eliminando comentario:', commentId);
            await deleteComment(commentId);
            console.log('✅ Comentario eliminado');
            if (onCommentDeleted) {
                onCommentDeleted(commentId);
            }
        } catch (err) {
            console.error('❌ Error deleting comment:', err.response?.data || err.message);
        }
    };

    if (!comments || comments.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2 mt-2">
            {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2 text-sm">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {comment.user?.avatar_url ? (
                            <img 
                                src={comment.user.avatar_url.startsWith('http') ? comment.user.avatar_url : `${BASE_URL}${comment.user.avatar_url}`} 
                                alt={comment.user.nombre} 
                                className="w-full h-full rounded-full object-cover" 
                            />
                        ) : (
                            comment.user?.nombre?.charAt(0).toUpperCase() || 'U'
                        )}
                    </div>
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
    );
};