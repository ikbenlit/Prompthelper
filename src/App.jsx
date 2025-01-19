import { Routes, Route } from 'react-router-dom';
import { PromptProvider } from './context/PromptContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import PromptDetail from './pages/PromptDetail';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <PromptProvider>
          <FavoritesProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
              <Navigation />
              <main className="container mx-auto px-4 py-8 flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/prompt/:id" element={<PromptDetail />} />
                  <Route path="/favorites" element={<Favorites />} />
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
  );
}

export default App; 