# VeggieFinder - Recipe Finder React App

A modern vegetarian recipe finder application built with React, featuring user authentication, recipe management, and interactive cooking modes.

## Features

- User Authentication (Sign up/Login with backend API + MongoDB)
- Browse vegetarian recipes from TheMealDB API
- Search recipes by ingredients or name
- Browse recipes by categories
- Save favorite recipes to your account
- Submit your own recipes
- Interactive Cook Mode with step-by-step instructions
- Dark/Light theme toggle
- Fully responsive design

## Tech Stack

- **Frontend**: React 18, React Router
- **Styling**: Bootstrap 5, Custom CSS
- **Icons**: Font Awesome
- **Backend/Auth**: Node.js + MongoDB (JWT)
- **API**: TheMealDB API
- **Build Tool**: Vite

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**

   The `.env` file should include the backend API base URL:
   ```
   VITE_API_BASE=http://localhost:3000
   ```

4. **Database Setup**

   The project uses a Node.js backend with MongoDB. See the `server/` folder for the backend configuration and database setup:
   - User authentication tables
   - `user_recipes` table for submitted recipes
   - `user_favorites` table for saved favorites
   - Row Level Security (RLS) policies for data protection

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   └── shared/            # Reusable components
│   │       ├── Navbar.jsx
│   │       ├── Footer.jsx
│   │       ├── RecipeModal.jsx
│   │       └── CookMode.jsx
│   ├── pages/                 # Page components
│   │   ├── Home.jsx
│   │   ├── Favorites.jsx
│   │   ├── Categories.jsx
│   │   └── SubmitRecipe.jsx
│   ├── contexts/              # React contexts
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── config/
│   │   └── api.js            # Frontend API helper (calls backend)
│   ├── utils/
│   │   └── api.js             # API utilities
│   ├── App.jsx                # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── .env                      # Environment variables
├── index.html               # HTML template
└── package.json             # Dependencies

```

## Features Details

### Authentication
- Email/password authentication via backend API (JWT + MongoDB)
- Protected routes for authenticated users
- Automatic session management

### Recipe Management
- Browse vegetarian recipes from TheMealDB
- Search by ingredients or recipe name
- View detailed recipe information including ingredients, instructions, and video tutorials
- Random recipe suggestion feature

### User Features (Requires Login)
- Save favorite recipes to your account (stored in the backend MongoDB)
- Submit your own recipes with ingredients and instructions
- View all your submitted recipes
- Remove recipes from favorites

### Cook Mode
- Step-by-step cooking instructions
- Full-screen distraction-free mode
- Navigation between steps
- Screen wake lock to keep device awake

### Theme Support
- Light and dark mode toggle
- Preference saved to localStorage
- Respects system theme preference

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Database Schema

### user_recipes
- `id` - UUID primary key
- `user_id` - References auth.users
- `name` - Recipe name
- `image_url` - Recipe image URL
- `instructions` - Cooking instructions
- `ingredients` - JSONB array of ingredients
- `created_at` - Timestamp

### user_favorites
- `id` - UUID primary key
- `user_id` - References auth.users
- `meal_id` - TheMealDB recipe ID
- `meal_name` - Recipe name
- `meal_image` - Recipe image URL
- `created_at` - Timestamp

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Secure authentication via backend (JWT + MongoDB)
- Environment variables for sensitive data

## Contributing

Feel free to submit issues and pull requests!

## License

MIT
