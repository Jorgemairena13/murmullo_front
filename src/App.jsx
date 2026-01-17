import { useState } from 'react'
import { Layout } from './components/Layout'
import { Route, Routes } from 'react-router-dom'
import { FeedPage } from './pages/FeedPage'
import { ExplorarPage } from './pages/ExplorarPage'
import { Profile } from './pages/Profilepage'
import { Login } from './pages/Login'
import  RegisterPage  from './pages/RegisterPage'
import { Busqueda } from './pages/BusquedaPage'



function App() {
  return (

    <Routes>
      <Route element={<Layout />}>

        <Route path='/' element={<FeedPage />} />
        <Route path='/explorar' element={<ExplorarPage />} />
        <Route path='/busqueda' element={<Busqueda />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<RegisterPage />} />


      </Route>
    </Routes>

  )
}

export default App
