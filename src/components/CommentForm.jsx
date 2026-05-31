import { useState } from 'react';
import { createComment } from '../services/commentService';

export const CommentForm = ({ postId, onCommentCreated }) => {
    const [texto, setTexto] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!texto.trim() || loading) return;

        setLoading(true);
        setError(null);
        try {
            const newComment = await createComment(postId, texto.trim());
            setTexto('');
            if (onCommentCreated) {
                onCommentCreated(newComment);
            }
        } catch (err) {
            console.error('Error creating comment:', err.response?.data || err.message);
            setError('Error al crear comentario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex items-center gap-2 py-2">
                <input
                    type="text"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Añadir un comentario..."
                    className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={!texto.trim() || loading}
                    className="text-purple-400 hover:text-purple-300 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? '...' : 'Publicar'}
                </button>
            </form>
            {error && (
                <p className="text-red-400 text-xs px-1 pb-1">{error}</p>
            )}
        </div>
    );
};
