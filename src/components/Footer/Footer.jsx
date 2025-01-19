import logo from '../../assets/ikbenlit_logo_banner_small.png';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-md mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-gray-600 dark:text-gray-400">Powered by</span>
          <img
            src={logo}
            alt="IkBenLit Logo"
            className="h-6"
          />
        </div>
      </div>
    </footer>
  );
} 