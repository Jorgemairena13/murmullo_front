import { useRef } from 'react';

export const ConfirmModal = ({ isOpen, onConfirm, onCancel, title, message, confirmText = 'Eliminar', cancelText = 'Cancelar' }) => {
    const overlayRef = useRef(null);

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onCancel();
    };

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm shadow-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-0.75-3.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 transition-all shadow-lg shadow-red-600/20"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
