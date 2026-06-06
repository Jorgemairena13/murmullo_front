import { Route, Routes } from 'react-router-dom'

import { Layout } from './components/Layout'
import { FeedPage } from './pages/FeedPage'
import { ExplorarPage } from './pages/ExplorarPage'
import { Profile } from './pages/Profilepage'
import { Busqueda } from './pages/BusquedaPage'
import { PostPage } from './pages/PostPage'
import { Login } from './pages/Login'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path='/' element={<FeedPage />} />
                        <Route path='/feed' element={<FeedPage />} />
                        <Route path='/explorar' element={<ExplorarPage />} />
                        <Route path='/busqueda' element={<Busqueda />} />
                        <Route path='/profile' element={<Profile />} />
                        <Route path='/profile/:id' element={<Profile />} />
                        <Route path='/post/:postId' element={<PostPage />} />
                    </Route>
                </Route>
                <Route path='*' element={
                    <div className="h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h1 className="text-2xl font-bold">Página no encontrada</h1>
                        <p className="text-gray-500">La ruta a la que intentas acceder no existe.</p>
                        <a href="/" className="mt-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                            Volver al inicio
                        </a>
                    </div>
                } />
            </Routes>
        </div>
    )
}

export default App
