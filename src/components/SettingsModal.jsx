import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/userService';
import { deleteAccount } from '../services/userService';
import { BASE_URL } from '../services/client';

export const SettingsModal = ({ isOpen, onClose }) => {
    const { user, logout, updateUser } = useAuth();
    const overlayRef = useRef(null);

    const [formData, setFormData] = useState({
        nombre: '',
        username: '',
        email: '',
        bio: '',
        is_private: false,
        avatar: null,
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmLogout, setConfirmLogout] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                nombre: user.nombre || '',
                username: user.username || '',
                email: user.email || '',
                bio: user.bio || '',
                is_private: user.is_private || false,
                avatar: null,
                current_password: '',
                password: '',
                password_confirmation: '',
            });
            setAvatarPreview(null);
            setErrors({});
            setServerError('');
            setConfirmLogout(false);
            setConfirmDelete(false);
        }
    }, [isOpen, user]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked :
                type === 'file' ? files[0] :
                    value
        }));

        if (type === 'file' && files[0]) {
            setAvatarPreview(URL.createObjectURL(files[0]));
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setServerError('');
        setLoading(true);

        const dataToSend = new FormData();
        dataToSend.append('nombre', formData.nombre);
        dataToSend.append('username', formData.username);
        dataToSend.append('email', formData.email);
        dataToSend.append('bio', formData.bio);
        dataToSend.append('is_private', formData.is_private ? 1 : 0);

        if (formData.avatar) {
            dataToSend.append('avatar', formData.avatar);
        }

        if (formData.current_password) {
            dataToSend.append('current_password', formData.current_password);
            dataToSend.append('password', formData.password);
            dataToSend.append('password_confirmation', formData.password_confirmation);
        }

        try {
            const result = await updateProfile(user.id, dataToSend);
            if (result.usuario || result.user || result) {
                updateUser(result.usuario || result.user || result);
            }
            setSuccessMsg('Cambios guardados correctamente');
            setTimeout(() => onClose(), 1500);
        } catch (error) {
            const errData = error.response?.data;
            if (error.response?.status === 422 && errData?.errors) {
                setErrors(errData.errors);
            } else {
                setServerError(errData?.message || 'Error al actualizar el perfil. Intenta de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        onClose();
    };

    const handleDeleteAccount = async () => {
        setDeletingAccount(true);
        try {
            await deleteAccount(user.id);
            await logout();
            onClose();
        } catch (err) {
            console.error('Error deleting account:', err);
            setServerError('Error al eliminar la cuenta. Intenta de nuevo.');
        } finally {
            setDeletingAccount(false);
        }
    };

    if (!isOpen) return null;

    const currentAvatarUrl = user?.avatar_url
        ? (user.avatar_url.startsWith('http') ? user.avatar_url : `${BASE_URL}${user.avatar_url}`)
        : null;

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between p-5 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
                    <h2 className="text-xl font-bold text-white">Configuración</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-5 space-y-6">
                    {serverError && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
                            {serverError}
                        </div>
                    )}
                    {successMsg && (
                        <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl text-sm text-center">
                            {successMsg}
                        </div>
                    )}

                    <section>
                        <h3 className="text-lg font-semibold text-white mb-4">Editar Perfil</h3>
                        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
                            <div className="flex flex-col items-center gap-3">
                                <div className="relative group">
                                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-700">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="avatar preview" className="w-full h-full object-cover" />
                                        ) : currentAvatarUrl ? (
                                            <img src={currentAvatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-500">
                                                {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <input
                                            type="file"
                                            name="avatar"
                                            onChange={handleChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                {errors.avatar && <p className="text-red-400 text-xs">{errors.avatar[0]}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1 pl-1">Nombre</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                                        required
                                    />
                                    {errors.nombre && <p className="text-red-400 text-xs mt-1 ml-1">{errors.nombre[0]}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1 pl-1">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                                        required
                                    />
                                    {errors.username && <p className="text-red-400 text-xs mt-1 ml-1">{errors.username[0]}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1 pl-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                                    required
                                />
                                {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email[0]}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1 pl-1">Biografía</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    maxLength={500}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none h-20"
                                />
                                {errors.bio && <p className="text-red-400 text-xs mt-1 ml-1">{errors.bio[0]}</p>}
                            </div>

                            <div className="flex items-center bg-gray-800/30 p-3 rounded-xl border border-gray-700/50">
                                <input
                                    id="is_private"
                                    name="is_private"
                                    type="checkbox"
                                    checked={formData.is_private}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-700 rounded cursor-pointer"
                                />
                                <label htmlFor="is_private" className="ml-3 block text-sm text-gray-300 cursor-pointer select-none">
                                    Cuenta <span className="text-white font-medium">Privada</span>
                                </label>
                            </div>

                            <div className="border-t border-gray-800 pt-4">
                                <h3 className="text-sm font-semibold text-gray-400 mb-3">Cambiar Contraseña (opcional)</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1 pl-1">Contraseña Actual</label>
                                        <input
                                            type="password"
                                            name="current_password"
                                            value={formData.current_password}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                                            placeholder="••••••••"
                                        />
                                        {errors.current_password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.current_password[0]}</p>}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1 pl-1">Nueva Contraseña</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1 pl-1">Confirmar</label>
                                            <input
                                                type="password"
                                                name="password_confirmation"
                                                value={formData.password_confirmation}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password[0]}</p>}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 rounded-xl font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-[0.98] ${
                                        loading
                                            ? 'bg-gray-700 cursor-not-allowed opacity-70'
                                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:shadow-purple-500/25'
                                    }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Guardando...
                                        </span>
                                    ) : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </section>

                    <hr className="border-gray-800" />

                    <section>
                        <h3 className="text-lg font-semibold text-white mb-3">Sesión</h3>
                        {confirmLogout ? (
                            <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
                                <p className="text-gray-300 text-sm">¿Cerrar sesión?</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setConfirmLogout(false)}
                                        className="flex-1 py-2 rounded-xl text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex-1 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-colors"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setConfirmLogout(true)}
                                className="w-full py-3 px-4 rounded-xl text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors text-left flex items-center gap-3"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Cerrar Sesión
                            </button>
                        )}
                    </section>

                    <hr className="border-gray-800" />

                    <section>
                        <h3 className="text-lg font-semibold text-red-400 mb-3">Zona de Peligro</h3>
                        {confirmDelete ? (
                            <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-4 space-y-3">
                                <p className="text-red-300 text-sm">Esta acción no se puede deshacer. ¿Eliminar tu cuenta?</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setConfirmDelete(false)}
                                        className="flex-1 py-2 rounded-xl text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={deletingAccount}
                                        className="flex-1 py-2 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {deletingAccount ? 'Eliminando...' : 'Eliminar Cuenta'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setConfirmDelete(true)}
                                className="w-full py-3 px-4 rounded-xl text-sm font-medium text-red-400 bg-red-900/20 border border-red-800/30 hover:bg-red-900/40 transition-colors text-left flex items-center gap-3"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Eliminar Cuenta
                            </button>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};
