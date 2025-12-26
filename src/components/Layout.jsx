import { Link, NavLink } from "react-router-dom"
import logo from "../assets/img/logo.png"


export const Layout = () => {
    const datosLink = [
        {
            className: 'fi fi-rr-home',
            text: 'Inicio',
            route: ''
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
            route: '/perfil'
        },
    ]

    return (
        <nav className="flex flex-col bg-slate-950 text-white w-48 h-screen">
            <div className="flex flex-col justify-center" >
                <NavLink to="/">
                    <img
                        src={logo}
                        alt="logo"
                        className="h-32 w-auto object-contain"
                    />
                </NavLink>

                <div className="flex justify-start flex-col gap-16 mt-10 items-start ml-6 font-bold text-2xl w-full">
                    {datosLink.map((datos) => (
                        <NavLink className={"flex text-white gap-4"} to={datos.route}>
                            <i className={datos.className}></i>
                            <span>{datos.text}</span>
                        </NavLink>
                    ))}

                </div>


            </div>
        </nav>
    )
}