import { useState } from "react"
import { login } from "../services/auth"
import { useNavigate } from "react-router-dom"

export const Login = () => {
    const navigate = useNavigate()
    const [credenciales,setCredenciales] = useState({
        email:'',
        password:''
    })

    const handleChange = (e)=>{
        setCredenciales({
            ...credenciales,
            [e.target.name]:e.target.value
        })

    }

    const handleSubmit = async (e)=>{
        e.preventDefault()
        try{
            console.log('Enviando datos' , credenciales)
            const data = await login(credenciales);
            localStorage.setItem('token',data.token)
            navigate('/',{replace:true})
        }catch(error){
            console.error(error);
            alert("Error al iniciar sesión. Revisa tus datos.");

        }

    }
    return (

        <form onSubmit={handleSubmit} className="text-white flex flex-col gap-4">
            
            <div className="flex flex-col">
                <label htmlFor="email">Email</label>
                <input 
                    type="email" 
                    name="email"
                    value={credenciales.email}
                    onChange={handleChange}
                    className="text-black p-2"
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="password">Contraseña</label>
                <input 
                    type="password" 
                    name="password" 
                    value={credenciales.password}
                    onChange={handleChange}
                    className="text-black p-2"
                />
            </div>

            
            <button type="submit" className="bg-blue-500 p-2 mt-4 rounded">
                Entrar
            </button>

        </form>
    )
        
}

export default Login