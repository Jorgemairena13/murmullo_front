# 🤖 Guía para Agentes de IA - Proyecto Murmullo

Este documento establece las directrices para la interacción y colaboración de agentes de IA con el proyecto frontend "Murmullo". El objetivo es asegurar que las contribuciones sean consistentes, mantengan la calidad del código y se alineen con la visión del proyecto.

---

## 🚀 Contexto del Proyecto

"Murmullo" es una aplicación de red social frontend desarrollada con:

*   **React (Vite):** Framework principal.
*   **Tailwind CSS:** Para estilos y diseño.
*   **React Router DOM:** Para la navegación.
*   **Axios:** Cliente HTTP para la comunicación con la API.

El backend es una API REST desarrollada con Laravel.

---

## 📂 Estructura del Proyecto (`src/`)

La lógica principal de la aplicación reside en el directorio `src/` con la siguiente organización:

*   `App.jsx`: Componente principal de la aplicación.
*   `assets/`: Archivos estáticos como imágenes y recursos.
*   `components/`: Componentes React reutilizables.
*   `context/`: Gestión del estado global mediante React Context API.
*   `hooks/`: Hooks personalizados de React.
*   `index.css`: Estilos globales de la aplicación.
*   `main.jsx`: Punto de entrada de la aplicación.
*   `pages/`: Componentes correspondientes a las diferentes vistas o páginas.
*   `services/`: Lógica para la interacción con la API.

---

## ✍️ Convenciones de Codificación

*   **Estilo:** Adherirse al estilo de código existente. Utilizar **ESLint** para verificar la calidad del código (`npm run lint`).
*   **Nomenclatura:** Mantener la coherencia en la nomenclatura de componentes, variables y funciones (camelCase para JS, PascalCase para componentes).
*   **Estilos (CSS):** Priorizar el uso de **Tailwind CSS** para la estilización. Evitar estilos en línea o archivos CSS/SCSS personalizados a menos que sea estrictamente necesario y no haya una alternativa con Tailwind.

---

## 📡 Interacción con la API

*   Toda la lógica de comunicación con el backend debe encapsularse en los archivos dentro de `src/services/`.
*   La URL base de la API se define en la variable de entorno `VITE_API_URL` (ej: `http://localhost:8000/api`). Asegúrate de usarla correctamente.

---

## 🛠️ Flujo de Trabajo y Verificación

1.  **Entendimiento Inicial:** Siempre comenzar leyendo `README.md` y `package.json` para comprender el alcance del proyecto, dependencias y scripts disponibles.
2.  **Instalación de Dependencias:** Ejecutar `npm install` antes de cualquier modificación si es necesario.
3.  **Desarrollo:** Implementar las funcionalidades siguiendo las convenciones establecidas.
4.  **Verificación Local:**
    *   Ejecutar la aplicación en desarrollo: `npm run dev`.
    *   Pasar el linter: `npm run lint`.
    *   Construir el proyecto para verificar errores: `npm run build`.
5.  **Pruebas:** Si existen tests (no se han identificado tests específicos en la estructura inicial, pero es una buena práctica), ejecutarlos y asegurar que pasen. Si se añade nueva funcionalidad compleja, considerar la creación de tests unitarios.
6.  **Comunicación:** Ante cualquier ambigüedad, decisión de diseño importante o cambio significativo, consultar con el usuario.

---

## 💡 Principios Generales

*   **Mínima Intervención:** Realizar los cambios estrictamente necesarios para cumplir la tarea.
*   **Reusabilidad:** Favorecer la creación de componentes y hooks reutilizables.
*   **Rendimiento:** Considerar el rendimiento al implementar nuevas funcionalidades.
