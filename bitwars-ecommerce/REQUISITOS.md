# Requisitos del Sistema y Tecnologías - Grupo Bitwars

**Tecnicatura Universitaria en Programación**  
**UTN Sede San Rafael Mendoza - Argentina**  
**Octubre de 2026**

Este documento detalla las herramientas, versiones y dependencias necesarias para el correcto funcionamiento del E-commerce de deportes.

---

## 🛠️ Software Prerrequisitos (Instalaciones locales)

Para levantar el proyecto en un entorno de desarrollo, se requiere tener instalado:

1. **Java Development Kit (JDK):** Versión 17 o superior (Recomendado Java 21 LTS).
2. **Node.js:** Versión 18 o superior (Incluye `npm`).
3. **Maven:** Versión 3.8 o superior (o usar el Maven Wrapper `./mvnw`).
4. **Git:** Para el control de versiones.
5. **Editor de Código:** Visual Studio Code (con las extensiones de Java y Spring Boot).

---

## ☕ Dependencias del Backend (Definidas en `pom.xml`)

El backend está construido con **Java + Spring Boot 3.2.4**. Las dependencias principales son:

- **Spring Web:** Para la creación de la API REST.
- **Spring Data JPA:** Para la persistencia y comunicación con PostgreSQL.
- **Spring Security:** Para la autenticación y autorización.
- **JJWT (Java JWT):** Para la generación y validación de tokens de seguridad (Login).
- **PostgreSQL Driver:** Conector oficial para la base de datos.
- **Lombok:** Para reducir código repetitivo (getters, setters, builders).

*Para descargar e instalar estas dependencias, ejecutar en la carpeta `backend`:*
```bash
mvn clean install

⚛️ Dependencias del Frontend (Definidas en package.json)

El frontend está construido con React + Vite. Las dependencias principales son:

    React: Biblioteca de interfaces de usuario.

    React Router DOM: Para la navegación entre páginas (Home, Login, Carrito).

    Axios: Cliente HTTP para conectar con la API del backend.

    Tailwind CSS: Framework de estilos para el diseño de la tienda.

Para descargar e instalar estas dependencias, ejecutar en la carpeta frontend:

npm install

🗄️ Base de Datos

    Motor: PostgreSQL.

    Proveedor Cloud: Neon (Serverless PostgreSQL).

    Configuración: Las credenciales de conexión se manejan de forma segura en el archivo application.properties (Backend).

    🚀 Guía de Ejecución Rápida

    Levantar el Backend:
    Abrir una terminal en la carpeta backend y ejecutar:
    bash

    mvn spring-boot:run
    