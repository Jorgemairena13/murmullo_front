import { NavLink } from "react-router-dom"
import logo from "../assets/img/logo.png"


export const SideBar = () => {
    const datosLink = [
        {
            className: 'fi fi-rr-home',
            text: 'Inicio',
            route: '/'
        },
        {
            className: 'fi fi-rr-search',
            text: 'Busqueda',
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
            route: '/profile'
        },

    ]

    return (

        <nav className="fixed bottom-0 left-0 bg-black text-white w-full h-16 gap-2 
        md:fixed 
        md:top-0 
        md:w-20 
        md:h-full
        lg:w-44">
            <div className="hidden 
            md:flex 
            md:flex-col 
            md:justify-center 
            md:items-center 
            md:mb-20
            md:m-4" >
                <NavLink to="/">
                    <img
                        src={logo}
                        alt="logo"
                        className="
                        md:block 
                        md:h-auto 
                        md:w-16 "
                    />
                </NavLink>
            </div>

            <div className="flex justify-around font-bold text-lg gap-6 mt-4  
                md:flex-col
                md:justify-center
                md:items-center
                md:m-4
                lg:items-start
                lg:justify-center
                ml-5
                " >

                {datosLink.map((datos) => (

                    <NavLink
                        className={({ isActive }) => {
                            const classBase = "flex transition-colors duration-300 text-white gap-4 text-3xl md:justify-center lg:text-xl"

                            const classActive = isActive ? "font-bold scale-125 md:scale-125 lg:scale-110 " : "font-normal"
                            return `${classBase}  ${classActive}`
                        }
                        }
                        to={datos.route}
                        key={datos.text}>
                        <i className={datos.className}></i>
                        <span className="hidden lg:block">{datos.text}</span>
                    </NavLink>
                ))}

            </div>



        </nav>
    )
}