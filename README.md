<div align="center">

# 🏆 Bitwars Sports

### E-commerce de indumentaria deportiva

[![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.4-6DB33F?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=flat-square&logo=postgresql)](https://neon.tech/)
[![License](https://img.shields.io/badge/License-Académico-blue?style=flat-square)](#-licencia)

**Proyecto final de la Tecnicatura Universitaria en Programación**
**UTN Sede San Rafael — Mendoza, Argentina — Octubre 2026**

[🌐 Demo]https://bitwars-sport.vercel.app/ · [📚 Wiki](../../wiki) · [🐛 Issues](../../issues)

</div>

---

## 📖 Sobre el proyecto

**Bitwars Sports** es una tienda online de camisetas y artículos deportivos desarrollada como proyecto integrador de la tecnicatura. Cubre el flujo completo de un e-commerce moderno: registro, catálogo, carrito, pago online con Mercado Pago, confirmación por webhook, descuento automático de stock y panel de administración.

El proyecto demuestra la integración end-to-end entre un **frontend SPA en React**, un **backend REST en Spring Boot**, una **base de datos PostgreSQL** en la nube, y servicios externos como **Mercado Pago**, **Cloudinary** y **UptimeRobot**.

---

## ✨ Características principales

### Para clientes
- 🔐 Registro y login con autenticación JWT
- 🛍️ Catálogo público con filtrado visual
- 🎨 Vista 360° de productos con Canvas
- 🛒 Carrito persistente (localStorage) con selección de talle
- 💳 Checkout integrado con Mercado Pago (sandbox y producción)
- 📧 Recuperación automática de carrito entre sesiones

### Para administradores
- 🛠️ Panel de administración protegido por rol
- ➕ Alta, edición y baja de productos
- 📸 Subida de imágenes a Cloudinary (principal, 360°, galería)
- 📊 Gestión de talles, stock y categorías
- 🚫 Protección contra borrado de productos con ventas activas

### Técnicas
- 🔒 Autenticación stateless con JWT (HS256, 24h)
- 🔄 Idempotencia en confirmación de pagos
- 💰 Uso de `BigDecimal` para precisión monetaria
- 🎯 Transacciones atómicas con `@Transactional`
- 🧩 Manejo global de errores con códigos HTTP semánticos
- 🎨 Canvas 2D para visor 360° a 60fps
- ☁️ Deploy automatizado con CI/CD desde GitHub

---

## 🏗️ Arquitectura

<pre>
┌─────────────────┐      HTTPS/JSON      ┌─────────────────┐
│   Frontend SPA  │ ──────────────────── │  Backend REST   │
│  React + Vite   │                      │   Spring Boot   │
│    (Vercel)     │ ◄────────────────────│    (Render)     │
└─────────────────>                      └─────────────────┘
         │                                        │
         ▼                                        ▼
    localStorage                              PostgreSQL
    - token JWT                                 (Neon)
    - carrito                                       │
         │                                          │
         ├───────────────────┬──────────────────────┘
         ▼                   ▼
    Mercado Pago        Cloudinary
         │
         ▼
    Webhook MP
</pre>

👉 Ver [[Arquitectura]] en la wiki para el detalle completo.

---

## 🛠️ Stack Tecnológico

### Backend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| Java | 17 | Lenguaje |
| Spring Boot | 3.2.4 | Framework |
| Spring Security | (SB) | Auth + autorización |
| Spring Data JPA | (SB) | ORM |
| PostgreSQL | Neon | Base de datos |
| JJWT | 0.11.5 | Tokens JWT |
| Mercado Pago SDK | 3.7.0 | Pagos |
| Cloudinary | 1.36.0 | Imágenes |
| Lombok | 1.18.46 | Boilerplate |
| Maven | (wrapper) | Build |

### Frontend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 18 | Librería de UI |
| Vite | 5 | Build tool |
| React Router | 6 | Navegación |
| Tailwind CSS | 4 | Estilos |
| Axios | 1.x | HTTP client |
| Canvas API | nativa | Visor 360° |

### Infraestructura
| Servicio | Uso |
|----------|-----|
| **Netlify** | Hosting frontend |
| **Render** | Hosting backend |
| **Neon** | PostgreSQL serverless |
| **Cloudinary** | CDN de imágenes |
| **UptimeRobot** | Anti-cold-start |
| **Mercado Pago** | Pasarela de pagos |

👉 Ver [[Stack Tecnológico]] para detalles completos.

---

## 🚀 Quick Start

### Requisitos previos
- **Java 17+**
- **Node.js 18+** con npm
- **PostgreSQL** local (o cuenta de Neon)
- Cuenta de **Mercado Pago** (credenciales test)
- Cuenta de **Cloudinary** (free tier)

### 1. Clonar el repositorio

```bash
git clone https://github.com/HotCode2025/Bitwars-Cuarto-Semestre-Proyecto-Integrador
cd bitwarsecommerce

cd backend

# Crear archivo .env en la raíz del backend
 .env 
DB_URL=jdbc:postgresql://localhost:5432/bitwars
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=$(openssl rand -base64 32)
MP_ACCESS_TOKEN=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
FRONTEND_URL=http://localhost:5173

# Ejecutar
./mvnw spring-boot:run

Backend disponible en http://localhost:8080


cd frontend

# Instalar dependencias
npm install

# Crear archivo .env
"VITE_API_URL=http://localhost:8080/api" > .env

# Ejecutar
npm run dev

Frontend disponible en http://localhost:5173


Crear el primer admin

Por defecto todos los usuarios se registran como CLIENTE. Para crear un admin:

UPDATE usuarios SET rol = 'ADMIN' WHERE email = 'tu-email@example.com';

Estructura del Proyecto

ecommerce/
├── backend/
│   ├── src/main/java/com/bitwars/ecommerce/
│   │   ├── config/         ← SecurityConfig, JwtAuthenticationFilter
│   │   ├── controllers/    ← Endpoints REST + GlobalExceptionHandler
│   │   ├── dto/            ← CheckoutRequest
│   │   ├── exceptions/     ← Excepciones de dominio
│   │   ├── models/         ← Entidades JPA + DTOs
│   │   ├── repositories/   ← Interfaces Spring Data JPA
│   │   ├── services/       ← Lógica de negocio
│   │   └── EcommerceApplication.java
│   ├── pom.xml
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/     ← Product360View, SplashScreen
│   │   ├── context/        ← AuthContext, CartContext, ProductosContext
│   │   ├── pages/          ← 7 páginas de la SPA
│   │   ├── services/       ← api.js (Axios)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md

🔐 Variables de entorno

Variable	Descripción	Ejemplo
DB_URL	URL JDBC	jdbc:postgresql://...
DB_USERNAME	Usuario DB	postgres
DB_PASSWORD	Password DB	***
JWT_SECRET	Base64 de 32 bytes	openssl rand -base64 32
MP_ACCESS_TOKEN	Token MP	TEST-xxx / APP_USR-xxx
CLOUDINARY_CLOUD_NAME	Cloud name	bitwars
CLOUDINARY_API_KEY	API key	***
CLOUDINARY_API_SECRET	API secret	***
FRONTEND_URL	URL frontend (CORS + back URLs)	https://...
Frontend
Variable	Descripción	Ejemplo
VITE_API_URL	URL del backend	https://.../api

🧪 Testing del flujo completo
Test manual end-to-end

    Abrir el frontend en el navegador.

    Registrarse con datos válidos.

    Agregar un producto al carrito (elegir talle si aplica).

    Ir al carrito → Pagar con Mercado Pago.

    Usar las tarjetas de test de MP:

        Aprobado: 5031 7557 3453 0604 — CVV 123 — Vencimiento 11/25

        Rechazado: 5031 4332 1540 6351 — CVV 123 — Vencimiento 11/25

    Verificar que el pedido pasa a PAGADO y el stock baja.

    Verificar en la base de datos
    -- Estado del pedido
    
SELECT id, estado, total, fecha FROM pedidos ORDER BY fecha DESC LIMIT 5;

-- Stock descontado
SELECT id, nombre, stock FROM productos WHERE id = <producto_id>;