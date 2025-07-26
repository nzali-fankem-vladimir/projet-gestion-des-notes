import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Composant de route protégée
 * Vérifie l'authentification et les rôles requis avant d'afficher le contenu
 * Redirige vers la page de connexion si non authentifié
 * 
 * @param {object} props - Props du composant
 * @param {array|string} props.allowedRoles - Rôles autorisés à accéder à cette route
 * @param {ReactNode} props.children - Contenu à afficher si autorisé
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated, hasRole } = useAuth();

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loader mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers login si non authentifié
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier les rôles si spécifiés
  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    // Rediriger vers le dashboard approprié si le rôle n'est pas autorisé
    const dashboardRoute = getDashboardRouteByRole(user.role);
    return <Navigate to={dashboardRoute} replace />;
  }

  // Afficher le contenu si tout est OK
  return children;
};

/**
 * Obtenir la route du dashboard selon le rôle
 * @param {string} role - Rôle de l'utilisateur
 * @returns {string} Route du dashboard
 */
const getDashboardRouteByRole = (role) => {
  switch (role) {
    case 'STUDENT':
      return '/student/dashboard';
    case 'TEACHER':  
      return '/teacher/dashboard';
    case 'ADMIN':
      return '/admin/dashboard';
    default:
      return '/login';
  }
};

export default ProtectedRoute;