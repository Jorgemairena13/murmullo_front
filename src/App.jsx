import { useState, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Componentes y Layout
import { Layout } from './components/Layout'

// Páginas de la App
import { FeedPage } from './pages/FeedPage'
import { ExplorarPage } from './pages/ExplorarPage'
import { Profile } from './pages/Profilepage'
import { Busqueda } from './pages/BusquedaPage'

// Páginas de Autenticación
// (Asegúrate de que Login se importa con {} o sin ellas según cómo lo tengas exportado)
import { Login } from './pages/Login' 
import RegisterPage from './pages/RegisterPage' 

function App() {
  const location = useLocation();
  
  // 1. Estado para la dirección de la animación
  const [direction, setDirection] = useState(0);
  // 2. Estado para saber de dónde venimos
  const [prevPath, setPrevPath] = useState(location.pathname);

  // Mapa de orden visual: Login (0) <-> Register (1)
  const pagesOrder = {
      "/login": 0,
      "/register": 1,
      // El resto de páginas no afectan tanto a esta transición específica
      "/": 2 
  };

  useEffect(() => {
      // Calculamos los índices (si no existe la ruta, asumimos 0)
      const currentOrder = pagesOrder[location.pathname] ?? 0;
      const prevOrder = pagesOrder[prevPath] ?? 0;

      // Actualizamos la dirección
      if (currentOrder > prevOrder) {
          setDirection(1); // Mover a la derecha (Next)
      } else if (currentOrder < prevOrder) {
          setDirection(-1); // Mover a la izquierda (Prev)
      }
      
      // Guardamos la ruta actual para la próxima vez
      setPrevPath(location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
    // 'custom={direction}' pasa el dato a Framer Motion
    <AnimatePresence custom={direction}>
        <Routes location={location} key={location.pathname}>
            
            {/* === ZONA AUTENTICACIÓN (Pantalla Completa) === */}
            {/* Están FUERA del Layout para poder hacer la transición 'slide' limpia */}
            <Route 
                path='/login' 
                element={<Login direction={direction} />} 
            />
            <Route 
                path='/register' 
                element={<RegisterPage direction={direction} />} 
            />

            {/* === ZONA APLICACIÓN (Con Barra de Navegación) === */}
            <Route element={<Layout />}>
                <Route path='/' element={<FeedPage />} />
                <Route path='/feed' element={<FeedPage />} />
                <Route path='/explorar' element={<ExplorarPage />} />
                <Route path='/busqueda' element={<Busqueda />} />
                <Route path='/profile' element={<Profile />} />
            </Route>

        </Routes>
    </AnimatePresence>
    </div>
  )
}

export default App
