import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import toast from 'react-hot-toast';

/**
 * Contexte d'authentification pour gérer l'état de connexion utilisateur
 * Supporte les 3 rôles : STUDENT, TEACHER, ADMIN
 * Gère le token JWT et la persistance de session
 */
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  // Configuration d'Axios avec le token
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Vérifier la validité du token au chargement
      verifyToken();
    } else {
      delete api.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);

  /**
   * Vérifier la validité du token JWT
   */
  const verifyToken = async () => {
    try {
      const response = await api.get('/api/auth/me');
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Token invalide:', error);
      // Token expiré ou invalide, déconnexion
      logout();
    }
  };

  /**
   * Connexion utilisateur
   * @param {string} username - Nom d'utilisateur
   * @param {string} password - Mot de passe
   */
  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await api.post('/api/auth/signin', {
        username,
        password
      });

      const { access_token, user: userData } = response.data;
      
      // Stocker le token et les données utilisateur
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(access_token);
      setUser(userData);
      
      // Configuration du header Authorization
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Redirection selon le rôle
      const dashboardRoute = getDashboardRoute(userData.role);
      navigate(dashboardRoute);
      
      toast.success(`Bienvenue, ${userData.firstname} ${userData.lastname}!`);
      
      return { success: true };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      const errorMessage = error.response?.data?.detail || 'Erreur de connexion';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Déconnexion utilisateur
   */
  const logout = () => {
    // Nettoyer le stockage local
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Réinitialiser l'état
    setToken(null);
    setUser(null);
    
    // Supprimer le header Authorization
    delete api.defaults.headers.common['Authorization'];
    
    // Rediriger vers la page de connexion
    navigate('/login');
    
    toast.success('Déconnexion réussie');
  };

  /**
   * Déterminer la route du tableau de bord selon le rôle
   * @param {string} role - Rôle de l'utilisateur
   * @returns {string} Route du tableau de bord
   */
  const getDashboardRoute = (role) => {
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

  /**
   * Vérifier si l'utilisateur a un rôle spécifique
   * @param {string|array} roles - Rôle(s) requis
   * @returns {boolean} True si l'utilisateur a le rôle requis
   */
  const hasRole = (roles) => {
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  };

  /**
   * Vérifier si l'utilisateur est connecté
   * @returns {boolean} True si connecté
   */
  const isAuthenticated = () => {
    return !!user && !!token;
  };

  /**
   * Obtenir les informations de l'utilisateur connecté
   * @returns {object|null} Données utilisateur ou null
   */
  const getCurrentUser = () => {
    return user;
  };

  /**
   * Mettre à jour les informations utilisateur
   * @param {object} userData - Nouvelles données utilisateur
   */
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * Formater le nom complet de l'utilisateur
   * @returns {string} Nom complet
   */
  const getFullName = () => {
    if (!user) return '';
    return `${user.firstname} ${user.lastname}`;
  };

  /**
   * Obtenir le libellé du rôle en français
   * @param {string} role - Rôle à traduire (optionnel, utilise le rôle actuel si non fourni)
   * @returns {string} Libellé du rôle
   */
  const getRoleLabel = (role = null) => {
    const userRole = role || user?.role;
    switch (userRole) {
      case 'STUDENT':
        return 'Étudiant';
      case 'TEACHER':
        return 'Enseignant';
      case 'ADMIN':
        return 'Administrateur';
      default:
        return 'Utilisateur';
    }
  };

  /**
   * Obtenir la couleur associée au rôle
   * @param {string} role - Rôle (optionnel)
   * @returns {string} Classe CSS de couleur
   */
  const getRoleColor = (role = null) => {
    const userRole = role || user?.role;
    switch (userRole) {
      case 'STUDENT':
        return 'text-student-600 bg-student-50';
      case 'TEACHER':
        return 'text-teacher-600 bg-teacher-50';
      case 'ADMIN':
        return 'text-admin-600 bg-admin-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Valeurs et méthodes exposées par le contexte
  const value = {
    // État
    user,
    loading,
    token,
    
    // Méthodes d'authentification
    login,
    logout,
    
    // Méthodes utilitaires
    hasRole,
    isAuthenticated,
    getCurrentUser,
    updateUser,
    getFullName,
    getRoleLabel,
    getRoleColor,
    getDashboardRoute,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};