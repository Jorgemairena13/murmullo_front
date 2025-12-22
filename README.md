# 📢 Murmullo - Red Social (TFG)

> **Estado:** 🚧 En Desarrollo (Work in Progress)

Este proyecto es el Frontend de una red social desarrollada como Trabajo de Fin de Grado (TFG). La aplicación permite a los usuarios compartir pensamientos, seguir a otros usuarios e interactuar mediante likes y comentarios.

El objetivo principal es consolidar conocimientos en **React** y arquitecturas SPA consumiendo una API REST.

---

## 🛠️ Stack Tecnológico

**Frontend:**
* ⚛️ **React** (Vite)
* 🎨 **Tailwind CSS** (Estilos y Diseño)
* 🛣️ **React Router DOM** (Navegación)
* 📡 **Axios** (Cliente HTTP)

**Backend (API):**
* 🦁 **Laravel** (API REST)
* 🔐 **Laravel Sanctum** (Autenticación)
* 🗄️ **MySQL** (Base de datos)

---

## 🚀 Funcionalidades (MVP)

El Producto Mínimo Viable incluye:

- [ ] **Autenticación:** Registro y Login (Token Based).
- [ ] **Feed:** Visualización cronológica de posts.
- [ ] **Creación:** Publicar nuevos posts (texto).
- [ ] **Social:**
    - [ ] Sistema de Likes.
    - [ ] Seguir/Dejar de seguir usuarios.
    - [ ] Comentarios.
- [ ] **Perfil:** Ver posts propios y de otros usuarios.

---

## ⚙️ Instalación y Uso

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/TU_USUARIO/murmullo_front.git](https://github.com/TU_USUARIO/murmullo_front.git)
    cd murmullo_front
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Renombra el archivo `.env.example` a `.env` (si aplica) o asegúrate de que la API de Laravel está corriendo en `http://localhost:8000`.

4.  **Ejecutar en desarrollo:**
    ```bash
    npm run dev
    ```


**Autor:** Jorge Enrique Fernández
**TFG:** Curso 2025/2026
