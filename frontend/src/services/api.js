import axios from 'axios';

/**
 * Configuration de l'API pour le système de gestion des notes
 * Utilise l'URL du backend depuis les variables d'environnement
 * Gère l'authentification JWT et les intercepteurs de requête/réponse
 */

// URL de base de l'API depuis les variables d'environnement
const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Instance Axios configurée
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 secondes de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log des requêtes en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Erreur intercepteur requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs globales
api.interceptors.response.use(
  (response) => {
    // Log des réponses en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    
    return response;
  },
  (error) => {
    console.error('❌ Erreur API:', error);
    
    // Gestion des erreurs spécifiques
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token expiré ou invalide
          console.log('Token expiré, redirection vers login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
          
        case 403:
          // Accès interdit
          console.error('Accès refusé:', data.detail);
          break;
          
        case 404:
          // Ressource non trouvée
          console.error('Ressource non trouvée:', data.detail);
          break;
          
        case 500:
          // Erreur serveur
          console.error('Erreur serveur:', data.detail);
          break;
          
        default:
          console.error(`Erreur ${status}:`, data.detail || error.message);
      }
    } else if (error.request) {
      // Erreur réseau
      console.error('Erreur réseau - serveur inaccessible');
    } else {
      // Autre erreur
      console.error('Erreur:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Services API organisés par domaine fonctionnel
 */

// ===========================
// SERVICES D'AUTHENTIFICATION
// ===========================
export const authService = {
  /**
   * Connexion utilisateur
   * @param {string} username - Nom d'utilisateur
   * @param {string} password - Mot de passe
   */
  login: (username, password) => 
    api.post('/api/auth/signin', { username, password }),

  /**
   * Obtenir les informations de l'utilisateur connecté
   */
  getCurrentUser: () => 
    api.get('/api/auth/me'),

  /**
   * Déconnexion (côté client seulement)
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  },
};

// ===========================
// SERVICES GESTION UTILISATEURS
// ===========================
export const userService = {
  /**
   * Créer un nouvel étudiant (admin seulement)
   * @param {object} studentData - Données de l'étudiant
   */
  createStudent: (studentData) => 
    api.post('/api/admin/users/students', studentData),

  /**
   * Créer un nouvel enseignant (admin seulement)
   * @param {object} teacherData - Données de l'enseignant
   */
  createTeacher: (teacherData) => 
    api.post('/api/admin/users/teachers', teacherData),

  /**
   * Obtenir tous les utilisateurs (admin seulement)
   */
  getAllUsers: () => 
    api.get('/api/admin/users'),

  /**
   * Obtenir un utilisateur par ID (admin seulement)
   * @param {string} userId - ID de l'utilisateur
   */
  getUserById: (userId) => 
    api.get(`/api/admin/users/${userId}`),

  /**
   * Obtenir un utilisateur par nom d'utilisateur (admin seulement)
   * @param {string} username - Nom d'utilisateur
   */
  getUserByUsername: (username) => 
    api.get(`/api/admin/users/username/${username}`),

  /**
   * Mettre à jour un utilisateur (admin seulement)
   * @param {string} userId - ID de l'utilisateur
   * @param {object} userData - Nouvelles données
   */
  updateUser: (userId, userData) => 
    api.put(`/api/admin/users/update/${userId}`, userData),

  /**
   * Supprimer un utilisateur (admin seulement)
   * @param {string} userId - ID de l'utilisateur
   */
  deleteUser: (userId) => 
    api.delete(`/api/admin/users/delete/${userId}`),
};

// ===========================
// SERVICES GESTION MATIÈRES
// ===========================
export const subjectService = {
  /**
   * Créer une nouvelle matière (admin seulement)
   * @param {object} subjectData - Données de la matière
   */
  createSubject: (subjectData) => 
    api.post('/api/subjects', subjectData),

  /**
   * Obtenir toutes les matières
   */
  getAllSubjects: () => 
    api.get('/api/subjects'),

  /**
   * Obtenir une matière par ID
   * @param {string} subjectId - ID de la matière
   */
  getSubjectById: (subjectId) => 
    api.get(`/api/subjects/${subjectId}`),

  /**
   * Mettre à jour une matière (admin seulement)
   * @param {string} subjectId - ID de la matière
   * @param {object} subjectData - Nouvelles données
   */
  updateSubject: (subjectId, subjectData) => 
    api.put(`/api/subjects/${subjectId}`, subjectData),

  /**
   * Supprimer une matière (admin seulement)
   * @param {string} subjectId - ID de la matière
   */
  deleteSubject: (subjectId) => 
    api.delete(`/api/subjects/${subjectId}`),
};

// ===========================
// SERVICES GESTION CLASSES
// ===========================
export const classService = {
  /**
   * Créer une nouvelle classe (admin seulement)
   * @param {object} classData - Données de la classe
   */
  createClass: (classData) => 
    api.post('/api/classes', classData),

  /**
   * Obtenir toutes les classes
   */
  getAllClasses: () => 
    api.get('/api/classes'),

  /**
   * Obtenir une classe par ID
   * @param {string} classId - ID de la classe
   */
  getClassById: (classId) => 
    api.get(`/api/classes/${classId}`),

  /**
   * Mettre à jour une classe (admin seulement)
   * @param {string} classId - ID de la classe
   * @param {object} classData - Nouvelles données
   */
  updateClass: (classId, classData) => 
    api.put(`/api/classes/${classId}`, classData),

  /**
   * Supprimer une classe (admin seulement)
   * @param {string} classId - ID de la classe
   */
  deleteClass: (classId) => 
    api.delete(`/api/classes/${classId}`),
};

// ===========================
// SERVICES GESTION NOTES
// ===========================
export const gradeService = {
  /**
   * Créer une nouvelle note (enseignant/admin)
   * @param {object} gradeData - Données de la note
   */
  createGrade: (gradeData) => 
    api.post('/api/grades', gradeData),

  /**
   * Obtenir toutes les notes d'un étudiant
   * @param {string} studentId - ID de l'étudiant
   */
  getStudentGrades: (studentId) => 
    api.get(`/api/grades/student/${studentId}`),

  /**
   * Obtenir toutes les notes d'une matière
   * @param {string} subjectId - ID de la matière
   */
  getSubjectGrades: (subjectId) => 
    api.get(`/api/grades/subject/${subjectId}`),

  /**
   * Mettre à jour une note (enseignant/admin)
   * @param {string} gradeId - ID de la note
   * @param {object} gradeData - Nouvelles données
   */
  updateGrade: (gradeId, gradeData) => 
    api.put(`/api/grades/${gradeId}`, gradeData),

  /**
   * Supprimer une note (enseignant/admin)
   * @param {string} gradeId - ID de la note
   */
  deleteGrade: (gradeId) => 
    api.delete(`/api/grades/${gradeId}`),

  /**
   * Calculer la moyenne d'un étudiant
   * @param {string} studentId - ID de l'étudiant
   * @param {string} semester - Semestre (optionnel)
   */
  calculateStudentAverage: (studentId, semester = null) => {
    const params = semester ? { semester } : {};
    return api.get(`/api/students/${studentId}/average`, { params });
  },
};

// ===========================
// SERVICES DOCUMENTS ET EXPORTS
// ===========================
export const documentService = {
  /**
   * Générer un relevé de notes PDF
   * @param {string} studentId - ID de l'étudiant
   * @param {string} semester - Semestre (optionnel)
   */
  generateTranscriptPDF: (studentId, semester = null) => {
    const params = semester ? { semester } : {};
    return api.get(`/api/students/${studentId}/transcript/pdf`, { params });
  },

  /**
   * Exporter toutes les notes en Excel (admin seulement)
   */
  exportGradesToExcel: () => 
    api.get('/api/admin/export/excel'),

  /**
   * Télécharger un fichier à partir de données base64
   * @param {string} base64Data - Données en base64
   * @param {string} filename - Nom du fichier
   * @param {string} mimeType - Type MIME du fichier
   */
  downloadBase64File: (base64Data, filename, mimeType = 'application/pdf') => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    
    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

// ===========================
// UTILITAIRES API
// ===========================
export const apiUtils = {
  /**
   * Vérifier si une erreur est une erreur réseau
   * @param {object} error - Erreur à vérifier
   */
  isNetworkError: (error) => {
    return !error.response && error.request;
  },

  /**
   * Extraire le message d'erreur d'une réponse API
   * @param {object} error - Erreur API
   */
  getErrorMessage: (error) => {
    if (error.response?.data?.detail) {
      return error.response.data.detail;
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'Une erreur inattendue s\'est produite';
  },

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  /**
   * Obtenir les informations utilisateur du stockage local
   */
  getStoredUser: () => {
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Erreur parsing utilisateur stocké:', error);
      return null;
    }
  },
};

export default api;