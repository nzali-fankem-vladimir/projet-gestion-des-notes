import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, 
  X, 
  Home, 
  FileText, 
  Users, 
  BookOpen, 
  GraduationCap,
  Settings,
  LogOut,
  User,
  BarChart3,
  PlusCircle,
  Download
} from 'lucide-react';

/**
 * Composant Layout principal
 * Fournit la structure de base avec sidebar et header
 * Adapte le menu selon le rôle de l'utilisateur
 * 
 * @param {object} props - Props du composant
 * @param {string} props.userRole - Rôle de l'utilisateur (STUDENT, TEACHER, ADMIN)
 * @param {ReactNode} props.children - Contenu de la page
 */
const Layout = ({ children, userRole }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, getFullName, getRoleLabel } = useAuth();
  const location = useLocation();

  // Configuration des menus selon le rôle
  const menuItems = {
    STUDENT: [
      { name: 'Tableau de bord', href: '/student/dashboard', icon: Home },
      { name: 'Mes notes', href: '/student/grades', icon: FileText },
      { name: 'Relevés PDF', href: '/student/transcripts', icon: Download },
    ],
    TEACHER: [
      { name: 'Tableau de bord', href: '/teacher/dashboard', icon: Home },
      { name: 'Saisie notes', href: '/teacher/grade-entry', icon: PlusCircle },
      { name: 'Mes classes', href: '/teacher/classes', icon: GraduationCap },
    ],
    ADMIN: [
      { name: 'Tableau de bord', href: '/admin/dashboard', icon: Home },
      { name: 'Utilisateurs', href: '/admin/users', icon: Users },
      { name: 'Matières', href: '/admin/subjects', icon: BookOpen },
      { name: 'Classes', href: '/admin/classes', icon: GraduationCap },
      { name: 'Rapports', href: '/admin/reports', icon: BarChart3 },
    ],
  };

  const currentMenuItems = menuItems[userRole] || [];

  /**
   * Vérifier si un lien est actif
   * @param {string} href - URL du lien
   * @returns {boolean} True si le lien est actif
   */
  const isActiveLink = (href) => {
    return location.pathname === href;
  };

  /**
   * Obtenir les couleurs du thème selon le rôle
   * @returns {object} Classes CSS pour les couleurs
   */
  const getThemeColors = () => {
    switch (userRole) {
      case 'STUDENT':
        return {
          primary: 'bg-student-600',
          primaryHover: 'hover:bg-student-700',
          text: 'text-student-600',
          bg: 'bg-student-50',
        };
      case 'TEACHER':
        return {
          primary: 'bg-teacher-600',
          primaryHover: 'hover:bg-teacher-700', 
          text: 'text-teacher-600',
          bg: 'bg-teacher-50',
        };
      case 'ADMIN':
        return {
          primary: 'bg-admin-600',
          primaryHover: 'hover:bg-admin-700',
          text: 'text-admin-600', 
          bg: 'bg-admin-50',
        };
      default:
        return {
          primary: 'bg-gray-600',
          primaryHover: 'hover:bg-gray-700',
          text: 'text-gray-600',
          bg: 'bg-gray-50',
        };
    }
  };

  const theme = getThemeColors();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo et titre */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <GraduationCap className={`h-8 w-8 ${theme.text}`} />
            <span className="ml-2 text-xl font-semibold text-gray-900">
              Notes
            </span>
          </div>
          
          {/* Bouton fermeture mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Informations utilisateur */}
        <div className={`px-6 py-4 border-b border-gray-200 ${theme.bg}`}>
          <div className="flex items-center">
            <div className={`flex-shrink-0 h-10 w-10 rounded-full ${theme.primary} flex items-center justify-center`}>
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {getFullName()}
              </p>
              <p className="text-xs text-gray-500">
                {getRoleLabel()}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-5 px-2 space-y-1">
          {currentMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveLink(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200
                  ${isActive 
                    ? `${theme.primary} text-white` 
                    : `text-gray-600 hover:bg-gray-50 ${theme.primaryHover.replace('bg-', 'hover:text-').replace('-600', '-600').replace('-700', '-600')}`
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bouton de déconnexion */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 md:ml-0">
        {/* Header mobile */}
        <div className="md:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                {/* Bouton menu mobile */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <Menu className="h-6 w-6" />
                </button>
                
                {/* Titre de la page */}
                <h1 className="ml-4 text-lg font-semibold text-gray-900">
                  Système de Gestion des Notes
                </h1>
              </div>
              
              {/* Informations utilisateur mobile */}
              <div className="flex items-center">
                <div className={`h-8 w-8 rounded-full ${theme.primary} flex items-center justify-center`}>
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu de la page */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;