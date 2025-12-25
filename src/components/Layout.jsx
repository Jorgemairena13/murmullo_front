import { Link, NavLink } from "react-router-dom"
import logo from "../assets/img/logo.png"


export const Layout = () => {
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
                    
                    <NavLinkLink className="flex gap-3">
                    
                        <i className="fi fi-rr-home"></i>
                        <h4>Inicio</h4>
                    
                    </NavLinkLink>
                    

                    <NavLink className="flex gap-3">
                        <i className="fi fi-rr-search"></i>
                        <h4>Busqueda</h4>
                    </NavLink>

                    <NavLink className="flex gap-3">
                        <i className="fi fi-rr-map"></i>
                        <h4>Explorar</h4>
                    </NavLink>

                    <NavLink className="flex gap-3">
                        <i class="fi fi-rr-user"></i>
                        <h4>Perfil</h4>
                    </NavLink>
                </div>


            </div>
        </nav>
    )
}