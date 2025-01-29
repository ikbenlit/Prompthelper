import { Routes, Route } from 'react-router-dom';
import { PromptProvider } from './context/PromptContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import PromptDetail from './pages/PromptDetail';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import { Link, useNavigate } from 'react-router-dom';

function TestAuthButton() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {user ? (
        <>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {user.email}
          </span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </>
      ) : (
        <Link
          to="/login"
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </Link>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <PromptProvider>
            <FavoritesProvider>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
                <Navigation />
                <main className="container mx-auto px-4 py-8 flex-grow">
                  <Routes>
                    <Route path="/login" element={<Login />} />
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
                    <Route path="/favorites" element={
                      <ProtectedRoute>
                        <Favorites />
                      </ProtectedRoute>
                    } />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </FavoritesProvider>
          </PromptProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App; 