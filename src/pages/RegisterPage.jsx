import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import client from "../services/client";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear Cuenta</h2>

                {serverError && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">

                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500"
                            required
                        />
                        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre[0]}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500"
                            required
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Biografía</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            maxLength={500}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 h-24 resize-none"
                            placeholder="Cuéntanos sobre ti..."
                            required
                        />
                        {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio[0]}</p>}
                    </div>

                    {/* Avatar (File) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Avatar (Foto de perfil)</label>
                        <input
                            type="file"
                            name="avatar"
                            onChange={handleChange}
                            accept="image/*"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            required
                        />
                        {errors.avatar && <p className="text-red-500 text-xs mt-1">{errors.avatar[0]}</p>}
                    </div>

                    {/* Is Private (Checkbox) */}
                    <div className="flex items-center">
                        <input
                            id="is_private"
                            name="is_private"
                            type="checkbox"
                            checked={formData.is_private}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_private" className="ml-2 block text-sm text-gray-900">
                            Hacer mi cuenta privada
                        </label>
                    </div>
                    {errors.is_private && <p className="text-red-500 text-xs mt-1">{errors.is_private[0]}</p>}

                    {/* Contraseñas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500"
                                required
                                minLength={6}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirmar</label>
                            <input
                                type="password"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}

                    <button
                        type="submit"
                        disabled={uploading}
                        className={`w-full text-white py-2 px-4 rounded-md transition duration-200 ${uploading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {uploading ? "Registrando..." : "Registrarse"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}