import { useState } from 'react';
import { createPost } from '../services/postService';

export const CreatePostForm = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!content.trim()) return;
        
        setLoading(true);
        
        try {
            const newPost = await createPost(content.trim());
            setContent('');
            if (onPostCreated) {
                onPostCreated(newPost);
            }
        } catch (err) {
            console.error('Error creating post:', err);
            alert('Error al publicar el post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Comparte una foto..."
                className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none"
                rows={2}
                disabled={loading}
            />
            <div className="flex justify-end mt-3">
                <button
                    type="submit"
                    disabled={!content.trim() || loading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-full font-medium transition-colors"
                >
                    {loading ? 'Publicando...' : 'Publicar'}
                </button>
            </div>
        </form>
    );
};