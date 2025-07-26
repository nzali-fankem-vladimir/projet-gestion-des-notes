/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      // Couleurs personnalisées pour le système de gestion des notes
      colors: {
        // Palette principale - tons blancs épurés
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Couleurs pour les rôles utilisateur
        student: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        teacher: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        admin: {
          50: '#faf5ff',
          100: '#f3e8ff',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
        },
        // Couleurs pour les notes/moyennes
        grade: {
          excellent: '#10b981', // Vert pour 16-20
          good: '#3b82f6',      // Bleu pour 12-15
          average: '#f59e0b',   // Jaune pour 8-11
          poor: '#ef4444',      // Rouge pour 0-7
        }
      },
      // Polices personnalisées
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      // Espacements personnalisés
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      // Animations personnalisées
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      // Ombres personnalisées
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'stats': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      // Rayons de bordure personnalisés
      borderRadius: {
        'xl2': '1rem',
        '2xl': '1.5rem',
      },
      // Largeurs et hauteurs personnalisées
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      // Tailles de grille personnalisées
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
      },
      // Points d'arrêt personnalisés
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      // Z-index personnalisés
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    // Plugin pour les formulaires
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    // Plugin pour la typographie
    require('@tailwindcss/typography'),
    // Plugin pour les ratios d'aspect
    require('@tailwindcss/aspect-ratio'),
  ],
  // Configuration du mode sombre (optionnel)
  darkMode: 'class',
  // Purge des styles inutilisés en production
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './src/**/*.{js,jsx,ts,tsx}',
      './public/index.html',
    ],
    options: {
      safelist: [
        'text-student-600',
        'text-teacher-600', 
        'text-admin-600',
        'bg-student-50',
        'bg-teacher-50',
        'bg-admin-50',
        'bg-grade-excellent',
        'bg-grade-good',
        'bg-grade-average',
        'bg-grade-poor',
      ],
    },
  },
};