import { NavLink } from "react-router-dom"
import logo from "../assets/img/logo.png"
import { useAuth } from "../context/AuthContext"


export const SideBar = () => {
    const { user } = useAuth();

    const datosLink = [
        {
            className: 'fi fi-rr-home',
            text: 'Inicio',
            route: '/'
        },
        {
            className: 'fi fi-rr-search',
            text: 'Buscar',
            route: '/busqueda'
        },
        {
            className: 'fi fi-rr-map',
            text: 'Explorar',
            route: '/explorar'
        },
        {
            className: 'fi fi-rr-user',
            text: 'Perfil',
            route: user ? `/profile/${user.id}` : '/profile'
        },
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-gray-800 z-50
            md:fixed md:top-0 md:left-0 md:bottom-0 md:right-auto md:w-20 md:h-full md:bg-black md:border-r md:border-t-0 md:border-gray-800 lg:w-24">

            <div className="hidden md:flex justify-center py-6">
                <NavLink to="/" className="p-2 rounded-xl hover:bg-gray-800/50 transition-all duration-300">
                    <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
                </NavLink>
            </div>

            <div className="flex justify-around items-center h-16 px-2
                md:flex-col md:h-auto md:py-4 md:px-0 md:gap-2">
                
                {datosLink.map((datos) => (
                    <NavLink
                        className={({ isActive }) => {
                            const baseClass = "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300"
                            const activeClass = isActive 
                                ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/20" 
                                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                            return `${baseClass} ${activeClass}`
                        }}
                        to={datos.route}
                        key={datos.text}
                        title={datos.text}
                    >
                        <i className={`${datos.className} text-xl`}></i>
                    </NavLink>
                ))}
            </div>
        </nav>
    )
}