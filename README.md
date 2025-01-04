# Aura - AI-Powered E-commerce Platform

Aura is a cutting-edge e-commerce platform built using the MERN (MongoDB, Express, React, Node.js) stack. It leverages AI for personalized shopping experiences, product recommendations, and efficient management for both customers and administrators.

## Features
- User authentication (sign up, login, and JWT-based authentication)
- User profiles with personalized recommendations
- Product catalog with search and filter functionality
- Shopping cart and order management
- Admin dashboard to manage products and orders
- AI-powered product recommendations
- Secure payment integration (if applicable)

## Tech Stack
- **Frontend:** React (with Vite for fast builds), Tailwind CSS, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)
- **Logging:** Pino for logging

## Getting Started

### Prerequisites
Ensure you have the following installed on your machine:

- **Node.js** (v16 or later)
- **MongoDB** (locally or use a cloud service like MongoDB Atlas)
- **Git** for cloning the repository
- **npm** or **yarn** for installing dependencies
- **Postman** or **Insomnia** for testing API endpoints
- **Stripe** account for payment integration (optional)
- **winston** for logging

### 1. Clone the repository

```bash
    git clone git@github.com:devkyoshi/aura.git
    cd backend
```


### 2. Install dependencies

```bash
    npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the `backend` directory and add the following environment variables:

```bash
    PORT=5000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
```

### 4. Start the server

development mode:

```bash
    npm run dev
```

production mode:
```bash
    npm start
```

### 5. Start the frontend

```bash
    cd frontend
    npm install
    npm run dev
```



