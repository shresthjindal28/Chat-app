import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Core components
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { FriendProvider } from './contexts/FriendContext';
import ProtectedRoute from './components/ProtectedRoute';

// Eager loaded pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Lazy loaded pages for better performance
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const AIChatPage = lazy(() => import('./pages/AIChatPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const FindUsersPage = lazy(() => import('./pages/FindUsersPage'));
const PublicProfilePage = lazy(() => import('./pages/PublicProfilePage'));
const LogoutPage = lazy(() => import('./pages/LogoutPage'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-dark-900">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-primary-400">Loading amazing content...</p>
    </div>
  </div>
);

const App = () => {
  const location = useLocation();

  return (
    <ThemeProvider>
      <AuthProvider>
        <FriendProvider>
          <CustomCursor />
          <Navbar />
          
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* Protected routes with lazy loading */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <DashboardPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <ChatPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/ai-chat" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <AIChatPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/gallery" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <GalleryPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <ProfilePage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <SettingsPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/users/:userId" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <PublicProfilePage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/find-users" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <FindUsersPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/logout" element={
                <Suspense fallback={<LoadingFallback />}>
                  <LogoutPage />
                </Suspense>
              } />
            </Routes>
          </AnimatePresence>
        </FriendProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;