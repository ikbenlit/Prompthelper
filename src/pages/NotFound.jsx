import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function NotFound() {
  const { language } = useLanguage();

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">404</h1>
      <p className="mb-4">
        {language === 'nl' ? 'Pagina niet gevonden' : 'Page not found'}
      </p>
      <Link to="/" className="btn btn-primary">
        {language === 'nl' ? 'Terug naar home' : 'Back to home'}
      </Link>
    </div>
  );
} 