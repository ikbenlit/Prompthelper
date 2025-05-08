import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { PromptProvider } from './context/PromptContext';
import Home from './pages/Home';
import Settings from './pages/Settings';
import PromptDetail from './pages/PromptDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import ForgetPassword from './pages/ForgetPassword';
import EmailVerificationPage from './pages/EmailVerificationPage';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <PromptProvider>
            <Routes>
              <Route path="/test" element={<div>Test Route Works!</div>} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgetPassword />} />
              <Route path="/verify-email" element={<EmailVerificationPage />} />
              <Route path="/verify-email/:oobCode" element={<EmailVerificationPage />} />

              {/* Protected routes met Layout */}
              <Route element={<Layout />}>
                <Route path="/" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />
                <Route path="/prompts/:id" element={
                  <ProtectedRoute>
                    <PromptDetail />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* NotFound route moet als laatste komen */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PromptProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
} 