import { useState, useRef } from 'react';
import { createPost, createPostWithImage, generatePostText } from '../services/postService';

export const CreatePostForm = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    const [generating, setGenerating] = useState(false);
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

    const handleGenerateText = async () => {
        if (!file || generating) return;
        setGenerating(true);
        setError(null);
        try {
            const data = await generatePostText(file);
            if (data.texto) setContent(data.texto);
        } catch (err) {
            console.error('Error generating text:', err);
            setError('Error al generar la descripción');
        } finally {
            setGenerating(false);
        }
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

            {file && !generating && !content.trim() && (
                <button
                    type="button"
                    onClick={handleGenerateText}
                    className="mt-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-1.5"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                    </svg>
                    Generar descripción con IA
                </button>
            )}

            {generating && (
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-purple-500" />
                    Generando descripción...
                </div>
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
