import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';
import logo from '../../assets/promptbuilder_logo.png';
import Navigation from '../Navigation/Navigation';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <Navigation />  {/* Dit vervangt de inline Navigation in Layout.jsx */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
