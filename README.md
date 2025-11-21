# VeggieFinder 🥗

VeggieFinder is a full-stack MERN application designed to help users discover, share, and manage vegetarian recipes. It features secure authentication, recipe categorization, and a personal favorites list.

## Features ✨

- **User Authentication**: Secure Signup, Login, and OTP Verification using JWT and Email.
- **Recipe Management**: Browse recipes by category (e.g., Indian), view details, and submit your own.
- **Favorites**: Save your favorite recipes for quick access.
- **Responsive Design**: Built with React and Bootstrap for a seamless experience on all devices.
- **Dark/Light Mode**: Toggle between themes for better readability.

## Tech Stack 🛠️

- **Frontend**: React (Vite), Bootstrap, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **Deployment**: Vercel (Serverless function support via `api/index.js`)

## Getting Started 🚀

Follow these instructions to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd VeggieFinder
    ```

2.  **Install Dependencies:**
    Since this project manages both frontend and backend dependencies in the root `package.json`:
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Server Configuration
PORT=5000

# Database Connection
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/veggiefinder

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Email Service (for OTPs)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

### Running the Application

1.  **Start the Backend Server:**
    ```bash
    npm run dev:backend
    ```
    The server will start on `http://localhost:5000`.

2.  **Start the Frontend Development Server:**
    Open a new terminal and run:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## API Endpoints 📡

- **Auth**:
    - `POST /api/auth/signup` - Register a new user
    - `POST /api/auth/login` - Login user
    - `POST /api/auth/verify-otp` - Verify email OTP
- **Recipes**:
    - `GET /api/recipes` - Get all recipes
    - `POST /api/recipes` - Create a new recipe (Protected)
- **Favorites**:
    - `GET /api/favorites` - Get user favorites (Protected)
    - `POST /api/favorites/:recipeId` - Add to favorites (Protected)

## Deployment

This project is configured for deployment on **Vercel**.
The `api/index.js` file serves as the entry point for serverless functions.

---
Made with 💚 by Ansh Yadav
