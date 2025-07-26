import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Composants d'authentification
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

// Composants des différentes interfaces
import StudentDashboard from './pages/student/StudentDashboard';
import StudentGrades from './pages/student/StudentGrades';
import StudentTranscripts from './pages/student/StudentTranscripts';

import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherGradeEntry from './pages/teacher/TeacherGradeEntry';
import TeacherClasses from './pages/teacher/TeacherClasses';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSubjects from './pages/admin/AdminSubjects';
import AdminClasses from './pages/admin/AdminClasses';
import AdminReports from './pages/admin/AdminReports';

// Composants communs
import Layout from './components/Layout';
import './App.css';

/**
 * Composant principal de l'application
 * Gère le routage et l'authentification pour les 3 types d'utilisateurs :
 * - Étudiants : consultation des notes, moyennes, téléchargement PDF
 * - Enseignants : saisie notes, gestion coefficients, visualisation classes
 * - Administrateurs : gestion complète (CRUD utilisateurs, matières, exports)
 */
function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            {/* Notifications toast globales */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#333',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />

            <Routes>
              {/* Route de connexion publique */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Redirection par défaut vers /login */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Routes protégées pour les étudiants */}
              <Route
                path="/student/*"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <Layout userRole="STUDENT">
                      <Routes>
                        <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
                        <Route path="/dashboard" element={<StudentDashboard />} />
                        <Route path="/grades" element={<StudentGrades />} />
                        <Route path="/transcripts" element={<StudentTranscripts />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Routes protégées pour les enseignants */}
              <Route
                path="/teacher/*"
                element={
                  <ProtectedRoute allowedRoles={['TEACHER']}>
                    <Layout userRole="TEACHER">
                      <Routes>
                        <Route path="/" element={<Navigate to="/teacher/dashboard" replace />} />
                        <Route path="/dashboard" element={<TeacherDashboard />} />
                        <Route path="/grade-entry" element={<TeacherGradeEntry />} />
                        <Route path="/classes" element={<TeacherClasses />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Routes protégées pour les administrateurs */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <Layout userRole="ADMIN">
                      <Routes>
                        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="/dashboard" element={<AdminDashboard />} />
                        <Route path="/users" element={<AdminUsers />} />
                        <Route path="/subjects" element={<AdminSubjects />} />
                        <Route path="/classes" element={<AdminClasses />} />
                        <Route path="/reports" element={<AdminReports />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Route catch-all pour les pages non trouvées */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;