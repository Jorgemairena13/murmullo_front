import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import client from "../services/client";
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/img/logo.png'
import Transition from "../components/Transition";

export default function RegisterPage({direction}) {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        bio: "",
        is_private: false,
        avatar: null,
        password: "",
        password_confirmation: ""
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked :
                type === 'file' ? files[0] :
                    value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setServerError("");
        setUploading(true);

        const dataToSend = new FormData();
        dataToSend.append('nombre', formData.nombre);
        dataToSend.append('email', formData.email);
        dataToSend.append('bio', formData.bio);
        dataToSend.append('is_private', formData.is_private ? 1 : 0);
        dataToSend.append('password', formData.password);
        dataToSend.append('password_confirmation', formData.password_confirmation);

        if (formData.avatar) {
            dataToSend.append('avatar', formData.avatar);
        }

        try {
            const res = await client.post("/register", dataToSend);

            if (res.data.token) {
                login(res.data.user, res.data.token);
                navigate("/");
            } else {
                navigate("/login");
            }

        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                setServerError("Error al registrar. Verifica tu conexión o intenta más tarde.");
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <Transition direction={direction}>
        <div className="min-h-screen flex bg-gray-900 overflow-hidden">
            
            {/* === SECCIÓN IZQUIERDA (FORMULARIO) === */}
            <div className="flex w-full lg:w-1/2 justify-center items-center bg-gray-900 px-6 py-12 lg:px-16 overflow-y-auto h-screen">
                <div className="w-full max-w-lg">
                    
                    {/* Cabecera Móvil (Visible solo en pantallas pequeñas) */}
                    <div className="lg:hidden mb-8 text-center">
                        <div className="h-12 w-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl mx-auto flex items-center justify-center shadow-lg mb-4">
                            <span className="text-xl font-bold text-white">M</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Crear Cuenta</h2>
                    </div>

                    <h2 className="hidden lg:block text-3xl font-bold text-white mb-2">Únete a Murmullo</h2>
                    <p className="hidden lg:block text-gray-400 mb-8">Rellena tus datos para empezar tu aventura.</p>

                    {serverError && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">

                        {/* GRUPO 1: Nombre y Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1 pl-1">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    placeholder="Tu Nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    required
                                />
                                {errors.nombre && <p className="text-red-400 text-xs mt-1 ml-1">{errors.nombre[0]}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1 pl-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="correo@ejemplo.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    required
                                />
                                {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email[0]}</p>}
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1 pl-1">Biografía</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                maxLength={500}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none h-24"
                                placeholder="Cuéntanos algo breve sobre ti..."
                                required
                            />
                            {errors.bio && <p className="text-red-400 text-xs mt-1 ml-1">{errors.bio[0]}</p>}
                        </div>

                        {/* Avatar */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1 pl-1">Avatar</label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    name="avatar"
                                    onChange={handleChange}
                                    accept="image/*"
                                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer bg-gray-800/50 rounded-xl border border-gray-700 focus:outline-none transition-all"
                                    required
                                />
                            </div>
                            {errors.avatar && <p className="text-red-400 text-xs mt-1 ml-1">{errors.avatar[0]}</p>}
                        </div>

                        {/* Checkbox Privada */}
                        <div className="flex items-center bg-gray-800/30 p-3 rounded-xl border border-gray-700/50">
                            <input
                                id="is_private"
                                name="is_private"
                                type="checkbox"
                                checked={formData.is_private}
                                onChange={handleChange}
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded cursor-pointer"
                            />
                            <label htmlFor="is_private" className="ml-3 block text-sm text-gray-300 cursor-pointer select-none">
                                Hacer mi cuenta <span className="text-white font-medium">Privada</span>
                            </label>
                        </div>

                        {/* GRUPO 2: Contraseñas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1 pl-1">Contraseña</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1 pl-1">Confirmar</label>
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    placeholder="••••••••"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    required
                                />
                            </div>
                        </div>
                        {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password[0]}</p>}

                        {/* Botón Submit */}
                        <button
                            type="submit"
                            disabled={uploading}
                            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.98]
                                ${uploading 
                                    ? "bg-gray-700 cursor-not-allowed opacity-70" 
                                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/25"
                                }`}
                        >
                            {uploading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creando cuenta...
                                </span>
                            ) : "Registrarse"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-gray-400">
                        <p>
                            ¿Ya tienes cuenta?{" "}
                            <Link to="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors hover:underline">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            
            <div className="hidden lg:flex w-1/2 bg-gradient-to-bl from-purple-900 via-indigo-900 to-blue-900 relative items-center justify-center overflow-hidden border-l border-white/5">
                {/* Formas animadas de fondo */}
                <div className="absolute top-20 right-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-screen filter blur-[80px] opacity-20 animate-blob"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-screen filter blur-[80px] opacity-20 animate-blob animation-delay-2000"></div>
                
                <div className="relative z-10 text-center px-12">
                    <div className="h-24 w-24 bg-white/10 backdrop-blur-md rounded-3xl mx-auto flex items-center justify-center shadow-2xl mb-8 ring-1 ring-white/20">
                        <img src={logo} alt="logo" className="h-auto w-16" />
                    </div>
                    <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">Bienvenido a <span className="text-blue-400">Murmullo</span></h2>
                    <p className="text-xl text-blue-100/80 max-w-md mx-auto leading-relaxed">
                        Estás a un paso de conectar con el mundo. Crea tu perfil y empieza a murmullar.
                    </p>
                </div>
            </div>

        </div>
        </Transition>
    );

}