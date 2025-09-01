import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Import all pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AddItem from './pages/AddItem';
import BrowseItems from './pages/BrowseItems';
import ItemDetails from './pages/ItemDetails';
import MyItems from './pages/MyItems';
import MyTrades from './pages/MyTrades';
import Notifications from './pages/Notifications';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Feedback from './pages/Feedback';
import About from './pages/About';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

// Layout for protected pages (with Navbar)
const ProtectedLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

// Public Route component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            <Route path="/about" element={<About />} />
            
            {/* Protected routes */}
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Home />
                  </ProtectedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Dashboard />
                  </ProtectedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/add-item" 
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <AddItem />
                  </ProtectedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/browse" 
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <BrowseItems />
                  </ProtectedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/item/:id" 
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <ItemDetails />
                  </ProtectedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-items" 
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <MyItems />
                  </ProtectedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-trades" 
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <MyTrades />
                  </ProtectedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Notifications />
                  </ProtectedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/search" 
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Search />
                  </ProtectedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Profile />
                  </ProtectedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/feedback" 
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Feedback />
                  </ProtectedLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Default route */}
            <Route path="/" element={<Navigate to="/login" />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
