# React + Vite

## Integrantes:
1. **Rojas Garcia Fernando
2. **Antonio Peña Jose Angel

## Apis elegidas:

Este proyecto se integra con las siguientes APIs REST y servicios web:

1. **EmailJS API** (`https://api.emailjs.com`)
   - **Uso:** Envío real de notificaciones y mensajes por correo electrónico a los clientes.
   - **Módulo:** Mensajes.

2. **Dog CEO API** (`https://dog.ceo/api/breeds/image/random`)
   - **Uso:** Obtención dinámica de imágenes aleatorias de perritos para adjuntarlas visualmente en las plantillas de los correos enviados.
   - **Módulo:** Mensajes.

3. **DummyJSON Users API** (`https://dummyjson.com/users?limit=5`)
   - **Uso:** Carga inicial de datos reales de prueba para la simulación y prueba de la tabla CRUD de usuarios (nombre, correo, teléfono y puesto).
   - **Módulo:** Usuarios.

4. **API Interna / LocalStorage (citasApi)**
   - **Uso:** Persistencia y gestión simulada de peticiones HTTP (GET, POST, PUT, DELETE) para el control completo de las citas médicas.
   - **Módulo:** Citas

## Proyecto desplegado
**https://t3-act8-eq12.rojasgarciafernando2.workers.dev

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
