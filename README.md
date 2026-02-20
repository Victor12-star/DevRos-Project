# Store Platform

## Professional Full Stack E-Commerce Web Application

Store Platform is a production-ready full-stack e-commerce web application built with modern technologies. The system includes authentication, an admin dashboard, campaign engine, full order return workflow, Swish payment structure, rating and review system, and chatbot support.

This project is designed as a serious portfolio-level application demonstrating backend architecture, secure API design, database modeling, and real-world ecommerce logic.

---

## Project Goals

The goal of this project is to build a secure, scalable, and structured e-commerce platform that demonstrates:

- Modern backend architecture
- Secure authentication and authorization
- Relational database design
- Campaign and discount logic
- Order lifecycle management
- Return and refund workflow
- Payment integration structure
- Review and rating validation
- Chatbot support
- Production deployment readiness

---

## Core Features

### Authentication System
- User registration
- User login
- Password hashing using bcrypt
- JSON Web Token authentication
- Role-based access control (User and Admin)
- Protected API routes

### Admin Dashboard
- Create, update, and delete products
- Manage campaigns
- View and manage orders
- Approve or reject return requests
- Moderate reviews
- View basic system statistics

### Product System
- Product listing
- Product details page
- Inventory tracking
- Search and filtering

### Cart and Order System
- Add to cart
- Update quantity
- Convert cart to order
- Order status tracking
- Order history page

Order status workflow:
- PENDING
- PAID
- SHIPPED
- DELIVERED
- RETURN_REQUESTED
- RETURN_APPROVED
- REFUNDED

### Campaign Engine
- Percentage discount
- Fixed discount
- Minimum order requirement
- Expiry date
- Usage limit
- Active or inactive status
- Optional coupon code
- Only one campaign per order
- Discount stored permanently in order

### Payment System
- Swish integration structure
- Payment status tracking
- Secure callback endpoint
- Order updated after payment confirmation

### Full Order Return
- The user can request a return after delivery
- Admin approval workflow
- Refund processing logic
- Order status updated to REFUNDED

### Review and Rating System
- 1 to 5 star ratings
- Verified purchase validation
- One review per user per product
- Stored average rating
- Admin moderation

### Chatbot
- 24-hour customer support endpoint
- FAQ responses
- Product recommendations
- Order lookup

---

## Technology Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express
- PostgreSQL
- Prisma ORM

### Security
- bcrypt
- jsonwebtoken
- helmet
- express rate limit
- dotenv

### DevOps
- Docker
- Nginx
- GitHub Actions
- VPS hosting
- Custom domain with SSL

---

## Project Structure

store-platform/
│
├── client/
│   └── React frontend
│
├── server/
│   └── Express backend
│
├── docker-compose.yml
├── .github/
└── README.md

---

## Installation Guide

### 1 Clone Repository

git clone https://github.com/your-username/store-platform.git  
cd store-platform

---

### 2 Setup Backend

cd server  
npm install  

Create a .env file inside the server folder:

PORT=5000  
DATABASE_URL=your_database_url  
JWT_SECRET=your_secret  

Run Prisma migration:

npx prisma migrate dev  

Start backend:

npm run dev  

---

### 3 Setup Frontend

cd client  
npm install  
npm run dev  

---

## Environment Variables

Never commit .env files to GitHub.

Backend requires:
- PORT
- DATABASE_URL
- JWT_SECRET
- SWISH credentials if applicable

Frontend requires:
- VITE_API_URL

---

## Deployment Plan

- Backend deployed on VPS using Docker
- Nginx reverse proxy configured
- SSL enabled using Let's Encrypt
- Frontend built for production
- Connected to custom domain

---

## Development Timeline

Estimated completion time:
8 to 10 weeks with structured development.

---

## Project Status

Currently in the structured development phase.

---

## Author

Your Name  
Full Stack Developer  
GitHub: https://github.com/your-username

---

## License

This project is developed for educational and portfolio purposes.
