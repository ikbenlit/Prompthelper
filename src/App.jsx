import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { PromptProvider } from './context/PromptContext';
import Home from './pages/Home';
import Settings from './pages/Settings';
import PromptDetail from './pages/PromptDetail';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import ForgetPassword from './pages/ForgetPassword';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <PromptProvider>
            <Routes>
              {/* Public routes zonder Layout */}
              <Route path="/login" element={<Login />} />

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
                <Route path="*" element={<NotFound />} />
                <Route path="/forgot-password" element={<ForgetPassword />} />
              </Route>
            </Routes>
          </PromptProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
} 