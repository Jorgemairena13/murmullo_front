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
                    {loading ? (
                        <span className="flex items-center gap-1">
                            <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        </span>
                    ) : 'Publicar'}
                </button>
            </form>
            {error && (
                <p className="text-red-400 text-xs px-1 pb-1">{error}</p>
            )}
        </div>
    );
};
