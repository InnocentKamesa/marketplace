Student Marketplace

A full-stack marketplace platform designed to connect students who want to buy and sell products or services.

🚀 Overview

Student Marketplace is a web application that provides students with a dedicated platform to list products and services, discover items from other students, and manage their marketplace activities.

The project was built as a practical full-stack application to explore real-world concepts such as authentication, CRUD operations, relational databases, REST APIs, inventory management, and marketplace workflows.

✨ Core Features

- 👤 User registration and authentication
- 🛍️ Product and service listings
- 🔎 Product discovery and search
- 📦 Stock quantity management
- 📝 Create, update, and delete listings
- 🗂️ Product categorization
- 💰 Product pricing
- 📍 Seller location
- 🔐 Authenticated API access
- 📊 Marketplace management
- 📱 Responsive interface

🏗️ Architecture

The application follows a client-server architecture:

Frontend
   │
   │ HTTP / REST API
   ▼
Express.js Backend
   │
   │ Sequelize ORM
   ▼
PostgreSQL Database

🛠️ Tech Stack

Frontend

- React
- Vite
- Tailwind CSS

Backend

- Node.js
- Express.js
- Sequelize
- Zod

Database

- PostgreSQL

Development & Deployment

- Git
- GitHub
- Vercel
- Render

📦 Product Model

Products/services contain information such as:

id
type
title
description
price
category
stockQty
status
location
seller

The "type" field allows the platform to support both:

- Products — physical goods
- Services — services offered by students

🔄 Marketplace Workflow

Student creates account
        ↓
Creates a product/service listing
        ↓
Listing becomes available
        ↓
Other students browse listings
        ↓
Buyer selects an item
        ↓
Order / purchase process
        ↓
Seller fulfills the order

🔐 Backend Responsibilities

The backend handles:

- Authentication
- Authorization
- Input validation
- Product CRUD operations
- Database interactions
- Stock management
- Business logic
- API responses
- Error handling

📡 Example API Endpoints

POST   /api/products
GET    /api/products
GET    /api/products/:id
PATCH  /api/products/:id
DELETE /api/products/:id

Authentication endpoints include:

POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout

«Endpoint names may change as the application evolves.»

🧠 What I Learned

Building this project gave me practical experience with:

- Designing REST APIs
- Building CRUD workflows
- Relational database design
- Sequelize associations
- PostgreSQL
- Authentication and authorization
- Request validation with Zod
- Separating controllers, models, and business logic
- Managing frontend/backend communication
- Debugging deployment and database issues

🔮 Future Improvements

Planned improvements include:

- [ ] Order management
- [ ] Buyer/seller dashboards
- [ ] Reviews and ratings
- [ ] Product image uploads
- [ ] Advanced search and filtering
- [ ] Notifications
- [ ] Payment integration
- [ ] Seller payouts
- [ ] Admin dashboard
- [ ] Improved analytics
- [ ] Production deployment

🎓 Project Purpose

This project is primarily a learning and portfolio project built to gain practical experience developing a real-world full-stack application.

It demonstrates my interest in building software that solves practical problems while strengthening my understanding of backend systems, databases, APIs, and modern web development.

👨🏾‍💻 Author

Innocent Kamesa

Computer Science Student | Aspiring Full-Stack Developer

Portfolio: https://innocentkamesa.vercel.app

GitHub: [Your GitHub Profile]
