# BaterX - Barter Trading Web App

BaterX is a modern barter trading web application built with React, Vite, and Tailwind CSS. It allows users to trade items with each other using Google Authentication for secure login.

## 🚀 Features

- **Google Authentication** - Secure login using Firebase Auth
- **13+ Pages** - Complete trading experience with intuitive navigation
- **Responsive Design** - Clean, simple UI built with Tailwind CSS
- **Item Management** - Add, browse, and manage trading items
- **Trade System** - Request and manage trades with other users
- **Search & Filter** - Find items by category, condition, price, and location
- **Notifications** - Stay updated with trade requests and activity
- **User Profiles** - Manage account information and trading preferences
- **Feedback System** - Submit feedback and suggestions

## 📱 Pages Included

1. **Login** - Google Authentication
2. **Register** - Backup registration form
3. **Home** - Welcome page after login
4. **Dashboard** - Overview of user activity and stats
5. **Add Item** - Form to list new items for trade
6. **Browse Items** - View all available items with filters
7. **Item Details** - Detailed view of individual items
8. **My Items** - Manage your listed items
9. **My Trades** - Track trade requests and history
10. **Notifications** - View trade updates and messages
11. **Search** - Advanced search with filters
12. **Profile** - User account management
13. **Feedback** - Submit feedback and suggestions
14. **About** - Information about BaterX

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Authentication**: Firebase Auth (Google Login)
- **State Management**: React Context API
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project (for Google Auth)

### 1. Clone or Setup the Project
```bash
# If starting fresh with Vite
npm create vite@latest baterx -- --template react
cd baterx

# Install dependencies
npm install react-router-dom firebase tailwindcss @tailwindcss/forms autoprefixer postcss
```

### 2. Configure Tailwind CSS
```bash
# Initialize Tailwind (if not done)
npx tailwindcss init -p
```

Update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication and Google sign-in method
4. Get your Firebase config

Update `src/firebase.js` with your Firebase configuration:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### 4. Run the Application

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   └── Navbar.jsx           # Navigation component
├── context/
│   └── AuthContext.jsx      # Authentication context
├── pages/
│   ├── Login.jsx            # Google login page
│   ├── Register.jsx         # Registration form
│   ├── Home.jsx             # Welcome home page
│   ├── Dashboard.jsx        # User dashboard
│   ├── AddItem.jsx          # Add new item form
│   ├── BrowseItems.jsx      # Browse all items
│   ├── ItemDetails.jsx      # Individual item view
│   ├── MyItems.jsx          # User's listed items
│   ├── MyTrades.jsx         # Trade management
│   ├── Notifications.jsx    # Notifications center
│   ├── Search.jsx           # Search with filters
│   ├── Profile.jsx          # User profile
│   ├── Feedback.jsx         # Feedback form
│   └── About.jsx            # About page
├── App.jsx                  # Main app component
├── main.jsx                 # App entry point
├── firebase.js              # Firebase configuration
└── index.css                # Tailwind CSS imports
```

## 🔧 Configuration

### Firebase Security Rules
Update your Firestore security rules for production:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚧 Development Notes

### Current Implementation
- **Authentication**: Google login implemented, email/password registration is a placeholder
- **Data Storage**: Uses local state and mock data (ready for backend integration)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Navigation**: Protected routes with authentication checks

### Future Enhancements
- Backend API integration (Node.js/Express, Python/Django, etc.)
- Real-time chat system
- Image upload and storage
- Push notifications
- Geolocation-based matching
- Payment integration for premium features
- Admin dashboard

## 🎨 UI/UX Design

The app uses a clean, minimal design with:
- **Color Scheme**: Blue primary (#2563eb), Gray secondary
- **Typography**: System fonts for readability
- **Components**: Cards, buttons, forms with consistent styling
- **Responsive**: Mobile-first design with breakpoints
- **Accessibility**: Semantic HTML and keyboard navigation

## 🔐 Security Features

- Google OAuth authentication
- Protected routes
- Input validation and sanitization
- CSRF protection ready
- Secure Firebase configuration

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🎯 Getting Started Quick Guide

1. **Install dependencies**: `npm install`
2. **Configure Firebase**: Update `src/firebase.js`
3. **Start development**: `npm run dev`
4. **Open browser**: Go to `http://localhost:5173`
5. **Test Google login**: Click "Sign in with Google"

That's it! You now have a fully functional barter trading app ready for development and customization.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
