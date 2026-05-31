import { useState, useRef } from 'react';
import { createPost, createPostWithImage } from '../services/postService';

export const CreatePostForm = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    const handleFileSelect = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handleRemoveImage = () => {
        setFile(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !file) return;

        setLoading(true);
        setError(null);

        try {
            let newPost;
            if (file) {
                newPost = await createPostWithImage(content.trim(), file);
            } else {
                newPost = await createPost(content.trim());
            }
            setContent('');
            handleRemoveImage();
            if (onPostCreated) onPostCreated(newPost);
        } catch (err) {
            console.error('Error creating post:', err);
            setError('Error al publicar. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Comparte una foto..."
                className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none"
                rows={2}
                disabled={loading}
            />

            {preview && (
                <div className="relative mt-2 inline-block">
                    <img
                        src={preview}
                        alt="preview"
                        className="max-h-48 rounded-lg object-contain bg-gray-800"
                    />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/80"
                    >
                        &times;
                    </button>
                </div>
            )}

            {error && (
                <p className="text-red-400 text-xs mt-2">{error}</p>
            )}

            <div className="flex items-center justify-between mt-3">
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="text-gray-400 hover:text-white transition-colors p-2"
                    disabled={loading}
                >
                    <i className="fi fi-rr-picture text-xl"></i>
                </button>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileSelect}
                    disabled={loading}
                />

                <button
                    type="submit"
                    disabled={(!content.trim() && !file) || loading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-full font-medium transition-colors"
                >
                    {loading ? 'Publicando...' : 'Publicar'}
                </button>
            </div>
        </form>
    );
};
