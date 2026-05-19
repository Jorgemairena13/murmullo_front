import { useState } from 'react';
import { createComment } from '../services/commentService';

export const CommentForm = ({ postId, onCommentCreated }) => {
    const [texto, setTexto] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!texto.trim() || loading) return;

        setLoading(true);
        try {
            console.log('📤 Enviando comentario al post:', postId, 'texto:', texto.trim());
            const newComment = await createComment(postId, texto.trim());
            console.log('✅ Comentario creado:', newComment);
            setTexto('');
            if (onCommentCreated) {
                onCommentCreated(newComment);
            }
        } catch (err) {
            console.error('❌ Error creating comment:', err.response?.data || err.message);
            alert('Error al crear comentario');
        } finally {
            setLoading(false);
        }
    };

    return (
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
                className="text-blue-500 hover:text-blue-400 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? '...' : 'Publicar'}
            </button>
        </form>
    );
};