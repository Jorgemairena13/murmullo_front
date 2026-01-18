import { useState } from "react"
import { login } from "../services/auth"
import { useNavigate } from "react-router-dom"
import logo from '../assets/img/logo.png'
import { Link } from "react-router-dom"

import Transition from "../components/Transition"
export const Login = ({direction}) => {
    const navigate = useNavigate()
    const [credenciales, setCredenciales] = useState({
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setCredenciales({
            ...credenciales,
            [e.target.name]: e.target.value
        })

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            console.log('Enviando datos', credenciales)
            const data = await login(credenciales);
            localStorage.setItem('token', data.token)
            navigate('/', { replace: true })
        } catch (error) {
            console.error(error);
            alert("Error al iniciar sesión. Revisa tus datos.");

        }

    }
    return (
        <Transition direction={direction}>
            <div className="min-h-screen flex bg-gray-900 overflow-hidden">


                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-800 via-indigo-900 to-purple-900 relative items-center justify-center overflow-hidden">

                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                    <div className="relative z-10 text-center px-12">
                        <div className="h-24 w-24 bg-white/10 backdrop-blur-md rounded-3xl mx-auto flex items-center justify-center shadow-2xl mb-8 ring-1 ring-white/20">
                            <img src={logo} alt="logo" className="h-auto w-16" />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Bienvenido a <span className="text-blue-400">Murmullo</span></h2>
                        <p className="text-lg text-blue-200 max-w-md mx-auto leading-relaxed">
                            Conecta, comparte y descubre lo que está pasando en tu mundo. Tu comunidad te espera.
                        </p>
                    </div>
                </div>

                
                {/* === SECCIÓN DERECHA (Formulario) === */}
                <div className="flex w-full lg:w-1/2 justify-center items-center bg-gray-900 px-6 py-12 lg:px-24">
                    <div className="w-full max-w-md">
                        
                        {/* Cabecera visible solo en móvil */}
                        <div className="lg:hidden mb-8 text-center">
                            <div className="h-16 w-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
                                <img src={logo} alt="logo" className="h-auto w-12" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Iniciar Sesión</h2>
                            <p className="text-gray-400 text-sm mt-2">¡Hola de nuevo! Te echábamos de menos.</p>
                        </div>

                        <h2 className="hidden lg:block text-3xl font-bold text-white mb-2">Iniciar Sesión</h2>
                        <p className="hidden lg:block text-gray-400 mb-8">Introduce tus datos para entrar.</p>



                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* EMAIL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5 pl-1">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="nombre@correo.com"
                                        value={credenciales.email}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5 pl-1">Contraseña</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        value={credenciales.password}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-12 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3.5 rounded-xl font-bold text-white text-lg shadow-lg transition-all transform active:scale-[0.98]
                                ${isLoading
                                        ? 'bg-gray-700 cursor-not-allowed opacity-70'
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/25'
                                    }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Entrando...
                                    </span>
                                ) : "Entrar"}
                            </button>
                        </form>

                        {/* CORRECCIÓN DEL FOOTER */}
                        <div className="mt-8 text-center text-gray-400">
                            <p>
                                ¿Aún no tienes cuenta?{" "}
                                {/* AQUÍ ESTÁ LA CORRECCIÓN: Usamos <Link> */}
                                <Link to="/register" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors ml-1">
                                    Regístrate gratis
                                </Link>
                            </p>
                        </div>
                        
                    </div>
                </div>
            </div>
        </Transition>
    );
}

export default Login