import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component dat controleert of een gebruiker is ingelogd en geverifieerd
 * @param {Object} props - Component props
 * @param {Boolean} props.requireVerification - Of email verificatie vereist is (standaard: true)
 * @param {React.ReactNode} props.children - Child componenten
 * @returns {React.ReactNode} - De beschermde route of een redirect
 */
export default function ProtectedRoute({ children, requireVerification = true }) {
  const { user, loading, isEmailVerified } = useAuth();

  // Toon loading indicator tijdens het laden van de auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Als gebruiker niet is ingelogd, redirect naar login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Als verificatie vereist is en de gebruiker niet geverifieerd is, redirect naar verificatiepagina
  if (requireVerification && !isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Anders, toon de beschermde content
  return children;
} 