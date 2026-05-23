import { useRef, useState } from 'react'
import { createPostWithImage } from '../services/postService'

export const UploadButton = () => {
    const inputRef = useRef(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = () => {
        if (!isLoading) inputRef.current?.click()
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setIsLoading(true)

        try {
            const newPost = await createPostWithImage('', file)
            console.log('Post creado:', newPost)
        } catch (err) {
            console.error('Error al subir:', err)
        } finally {
            setIsLoading(false)
            e.target.value = ''
        }
    }

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
                disabled={isLoading}
            />
            <button
                onClick={handleClick}
                className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 text-green-400 hover:text-white hover:bg-green-600/30 disabled:opacity-50"
                disabled={isLoading}
                title="Subir archivo"
            >
                {isLoading ? (
                    <span className="block w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                    <i className="fi fi-rr-upload text-xl"></i>
                )}
            </button>
        </>
    )
}
