# 🛒 Simple Shop
A simple but powerful e-commerce application built with Fastify, MySQL, MongoDB, and Redis, integrating multiple technologies and modern development standards.

## 📷 Screenshots
*(Adicione aqui imagens com: `![alt text](caminho/para/imagem.png)`)*

## 🚀 Technologies Used
- **Fastify** – Fast and efficient web framework for Node.js
- **MySQL + Sequelize** – Relational database for managing users, orders, and order items
- **MongoDB + Mongoose** – NoSQL database for managing the product catalog
- **Redis** – In-memory storage for sessions and cache
- **Argon2** – Secure hash for passwords
- **EJS** – Server-side rendering template engine
- **Node.js** – Server-side JavaScript runtime

## 📂 Project Structure
src/
├── config/ # Environment and connection settings
├── models/
│ ├── mongoose/ # MongoDB models (e.g., Item)
│ └── sequelize/ # MySQL models (User, Order, OrderItem)
├── plugins/ # Integrations with databases and Redis
├── routes/ # Application routes (admin, shop, user, etc.)
└── views/ # EJS templates

markdown
Copiar
Editar

## ⚙️ Features
- Product Management (**MongoDB**)
- Order and Order Item Management (**MySQL**)
- Administration Panel with order management and status change ("pending" → "shipped")
- User authentication with passwords encrypted in **Argon2**
- Persistent sessions with **Redis**
- **EJS** template engine for dynamic rendering

## 📦 Prerequisites
- Node.js v18+
- MySQL
- MongoDB
- Redis
