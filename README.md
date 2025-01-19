# Aura - AI-Powered E-learning Platform

Aura is an AI-powered e-learning platform that provides personalized learning experiences to users. It uses machine learning algorithms to analyze user behavior and provide personalized recommendations based on their learning preferences. The platform also offers a wide range of courses on various topics, including programming, data science, machine learning, and more. Users can sign up, log in, and access personalized recommendations based on their learning preferences. They can also track their progress, earn certificates, and interact with other users through the platform.


## Features
- User authentication (sign up, login, and JWT-based authentication)
- User profiles with personalized recommendations


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

## API Endpoints

All API endpoints are prefixed with `/api`.

All routes are protected and require a valid JWT to access the resources. The JWT should be sent in the `Authorization` header as a Bearer token except `api/login`, `api/register`.

### Auth Routes

- **POST `/api/auth/register`:** Create a new user account 
  - By default, the role is set to `student`. Admins can update the role to `teacher` or `admin` in the database.
- **POST `/api/auth/login`:** Login with email and password

### User Routes

- **GET `/api/user/me/:user_id` :** Get the current user's profile
- **POST `/api/user/update/:user_id`:** Update the current user's profile
- **POST `/api/user/remove/:user_id`:** Delete the current user's account

NOTE: Replace `:user_id` with the user's ID in the request URL.


## User Permission & Authentication Workflow

### Authentication Workflow

1. **Sign up:** Users can sign up by providing their name, email, and password. The password is hashed using bcrypt before being stored in the database.
2. **Login:** Users can log in using their email and password. If the credentials are valid, a JSON Web Token (JWT) is generated and sent to the client.
3. **Authentication:** The client sends the JWT in the `Authorization` header for protected routes. The server verifies the JWT and grants access to the protected resources if the token is valid.
4. **Logout:** Users can log out by deleting the JWT stored on the client side.

### User Permission Workflow

This project uses role-based access control (RBAC) to manage user permissions. There are three roles:
1. **Student:** Default role assigned to all students. Students can view courses, enroll in courses, and view their progress.
2. **Instructors:** Instructors can create courses, update courses, and view analytics for their courses.
3. **Admin:** Admins have full access to all resources. They can create, update, and delete courses, users, and other resources.

Once the user logged in, the server sends a JWT with `{id, role}` payload. The client stores the JWT in local storage and sends it in the `Authorization` header for protected routes.

**`Jwt authentication middleware checks`** if the jwt is present or not. If present, it decodes the jwt and sends the payload (`{id, role}`)  to the next middleware.

**`Role-based authorization middleware`** checks if the user has the required permissions to access the resource. If the user has the required permissions, the request is forwarded to the next middleware. Otherwise, a `UNAUTHORIZED` response is sent.


