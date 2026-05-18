# Murmullo — Frontend React

Frontend de **Murmullo**, una red social desarrollada como Trabajo de Fin de Grado (DAW). SPA construida con React y Tailwind CSS que consume la API REST del backend en Laravel.

> 🔗 **Backend:** [github.com/Jorgemairena13/Murmullo](https://github.com/Jorgemairena13/Murmullo) · 🌐 **Demo en producción:** [murmullo-front.vercel.app](murmullo-front.vercel.app)

---

## Stack tecnológico

- **Framework:** React 18 (Vite)
- **Estilos:** Tailwind CSS
- **Navegación:** React Router DOM
- **HTTP:** Axios
- **Autenticación:** Token Bearer (Laravel Sanctum)
- **Despliegue:** Vercel

---

## Funcionalidades

- Registro e inicio de sesión con autenticación por token
- Feed personalizado con publicaciones de usuarios seguidos
- Crear, editar y eliminar publicaciones propias
- Sistema de likes en publicaciones
- Sistema de comentarios
- Seguir y dejar de seguir usuarios
- Ver perfil propio y de otros usuarios
- Rutas protegidas — redirige a login si no hay sesión activa
- Persistencia de sesión mediante token almacenado

---

## Arquitectura

La aplicación es una SPA completamente desacoplada del backend. Toda la comunicación se realiza mediante peticiones HTTP a la API REST. No hay renderizado en servidor — React gestiona el estado y el enrutado en cliente.

```
React SPA  ──── Axios / HTTP ────→  Laravel API REST  ──→  MySQL
```

Las rutas protegidas verifican la existencia del token antes de renderizar. Si no hay sesión activa, redirigen automáticamente a `/login`.

---

## Instalación local

### Requisitos previos

- Node.js 18+
- npm
- Backend de Murmullo levantado en local ([ver instrucciones](https://github.com/Jorgemairena13/Murmullo))

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Jorgemairena13/murmullo_front.git
cd murmullo_front

# 2. Instalar dependencias
npm install

# 3. Configurar la URL del backend
# Crea un archivo .env en la raíz con:
VITE_API_URL=http://localhost:8000/api

# 4. Arrancar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build de producción

```bash
npm run build
```

---

## Estructura del proyecto

```
src/
├── components/       # Componentes reutilizables (Post, Comment, Avatar...)
├── pages/            # Vistas principales (Feed, Login, Register, Profile...)
├── context/          # AuthContext — gestión global de sesión
├── services/         # Llamadas a la API (authService, postService...)
└── main.jsx          # Punto de entrada
```

---

## Autor

**Jorge Enrique Fernández**
[linkedin.com/in/jorge-fernandez-dev](https://linkedin.com/in/jorge-fernandez-dev) · [jorgefernandez.vercel.app](https://jorgefernandez.vercel.app) · [github.com/Jorgemairena13](https://github.com/Jorgemairena13)
