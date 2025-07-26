import React, { createContext, useContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Contexte de notification pour gérer les messages à travers l'application
 * Utilise react-hot-toast pour l'affichage des notifications
 * Fournit des méthodes standardisées pour différents types de messages
 */
const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification doit être utilisé dans un NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  /**
   * Ajouter une notification à l'historique (pour référence future)
   * @param {object} notification - Objet notification
   */
  const addToHistory = useCallback((notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Garder 50 max
  }, []);

  /**
   * Afficher une notification de succès
   * @param {string} message - Message à afficher
   * @param {object} options - Options supplémentaires
   */
  const success = useCallback((message, options = {}) => {
    const notification = {
      type: 'success',
      message,
      ...options
    };
    
    addToHistory(notification);
    
    return toast.success(message, {
      duration: options.duration || 4000,
      position: options.position || 'top-right',
      ...options
    });
  }, [addToHistory]);

  /**
   * Afficher une notification d'erreur
   * @param {string} message - Message à afficher
   * @param {object} options - Options supplémentaires
   */
  const error = useCallback((message, options = {}) => {
    const notification = {
      type: 'error',
      message,
      ...options
    };
    
    addToHistory(notification);
    
    return toast.error(message, {
      duration: options.duration || 6000,
      position: options.position || 'top-right',
      ...options
    });
  }, [addToHistory]);

  /**
   * Afficher une notification d'avertissement
   * @param {string} message - Message à afficher
   * @param {object} options - Options supplémentaires
   */
  const warning = useCallback((message, options = {}) => {
    const notification = {
      type: 'warning',
      message,
      ...options
    };
    
    addToHistory(notification);
    
    return toast(message, {
      duration: options.duration || 5000,
      position: options.position || 'top-right',
      icon: '⚠️',
      style: {
        background: '#fef3c7',
        color: '#92400e',
        border: '1px solid #fcd34d'
      },
      ...options
    });
  }, [addToHistory]);

  /**
   * Afficher une notification d'information
   * @param {string} message - Message à afficher
   * @param {object} options - Options supplémentaires
   */
  const info = useCallback((message, options = {}) => {
    const notification = {
      type: 'info',
      message,
      ...options
    };
    
    addToHistory(notification);
    
    return toast(message, {
      duration: options.duration || 4000,
      position: options.position || 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#dbeafe',
        color: '#1e40af',
        border: '1px solid #93c5fd'
      },
      ...options
    });
  }, [addToHistory]);

  /**
   * Afficher une notification de chargement
   * @param {string} message - Message à afficher
   * @param {object} options - Options supplémentaires
   * @returns {function} Fonction pour mettre à jour ou fermer la notification
   */
  const loading = useCallback((message, options = {}) => {
    const notification = {
      type: 'loading',
      message,
      ...options
    };
    
    addToHistory(notification);
    
    return toast.loading(message, {
      position: options.position || 'top-right',
      ...options
    });
  }, [addToHistory]);

  /**
   * Afficher une notification de promesse (avec états loading/success/error)
   * @param {Promise} promise - Promesse à suivre
   * @param {object} messages - Messages pour chaque état { loading, success, error }
   * @param {object} options - Options supplémentaires
   */
  const promise = useCallback((promise, messages, options = {}) => {
    const notification = {
      type: 'promise',
      messages,
      ...options
    };
    
    addToHistory(notification);
    
    return toast.promise(promise, messages, {
      position: options.position || 'top-right',
      ...options
    });
  }, [addToHistory]);

  /**
   * Fermer toutes les notifications actives
   */
  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  /**
   * Fermer une notification spécifique
   * @param {string} toastId - ID de la notification à fermer
   */
  const dismiss = useCallback((toastId) => {
    toast.dismiss(toastId);
  }, []);

  /**
   * Notifications spécialisées pour le système de gestion des notes
   */
  
  /**
   * Notification pour une action réussie sur les notes
   * @param {string} action - Action effectuée (créée, modifiée, supprimée)
   * @param {string} target - Cible de l'action (note, utilisateur, matière, etc.)
   */
  const gradeAction = useCallback((action, target = 'note') => {
    const messages = {
      créée: `✅ ${target.charAt(0).toUpperCase() + target.slice(1)} créée avec succès`,
      modifiée: `✏️ ${target.charAt(0).toUpperCase() + target.slice(1)} modifiée avec succès`,
      supprimée: `🗑️ ${target.charAt(0).toUpperCase() + target.slice(1)} supprimée avec succès`
    };
    
    success(messages[action] || `Action "${action}" effectuée avec succès`);
  }, [success]);

  /**
   * Notification pour les erreurs de validation
   * @param {array|string} errors - Erreurs de validation
   */
  const validationError = useCallback((errors) => {
    if (Array.isArray(errors)) {
      errors.forEach(err => error(`❌ ${err}`));
    } else {
      error(`❌ ${errors}`);
    }
  }, [error]);

  /**
   * Notification pour les actions d'import/export
   * @param {string} type - Type d'action (import, export)
   * @param {string} format - Format du fichier (PDF, Excel, etc.)
   * @param {boolean} success - Succès ou échec
   */
  const fileAction = useCallback((type, format, success) => {
    const action = type === 'import' ? 'importé' : 'exporté';
    if (success) {
      success(`📄 Fichier ${format} ${action} avec succès`);
    } else {
      error(`❌ Erreur lors de l'${type} du fichier ${format}`);
    }
  }, [success, error]);

  /**
   * Notification de bienvenue personnalisée selon le rôle
   * @param {string} name - Nom de l'utilisateur
   * @param {string} role - Rôle de l'utilisateur
   */
  const welcome = useCallback((name, role) => {
    const roleLabels = {
      STUDENT: 'étudiant',
      TEACHER: 'enseignant',
      ADMIN: 'administrateur'
    };
    
    const emoji = {
      STUDENT: '🎓',
      TEACHER: '👨‍🏫',
      ADMIN: '👨‍💼'
    }[role] || '👋';
    
    success(`${emoji} Bienvenue ${name} ! Vous êtes connecté en tant qu'${roleLabels[role] || 'utilisateur'}.`);
  }, [success]);

  /**
   * Obtenir l'historique des notifications
   * @param {number} limit - Nombre maximum de notifications à retourner
   * @returns {array} Historique des notifications
   */
  const getHistory = useCallback((limit = 10) => {
    return notifications.slice(0, limit);
  }, [notifications]);

  /**
   * Nettoyer l'historique des notifications
   */
  const clearHistory = useCallback(() => {
    setNotifications([]);
  }, []);

  // Valeurs et méthodes exposées par le contexte
  const value = {
    // Méthodes de notification de base
    success,
    error,
    warning,
    info,
    loading,
    promise,
    
    // Méthodes de contrôle
    dismiss,
    dismissAll,
    
    // Méthodes spécialisées
    gradeAction,
    validationError,
    fileAction,
    welcome,
    
    // Historique
    notifications,
    getHistory,
    clearHistory,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};