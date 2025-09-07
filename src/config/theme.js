// Modern trading platform color palette and theme configuration
export const theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      500: '#3b82f6',
      600: '#2563eb', // Primary blue
      700: '#1d4ed8',
      900: '#1e3a8a'
    },
    secondary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e', // Success green
      600: '#16a34a',
      700: '#15803d'
    },
    accent: {
      400: '#facc15', // Yellow CTA
      500: '#eab308',
      600: '#ca8a04'
    },
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    }
  },
  gradients: {
    primary: 'from-blue-600 to-blue-700',
    secondary: 'from-green-500 to-green-600', 
    accent: 'from-yellow-400 to-yellow-500',
    trading: 'from-blue-600 via-purple-600 to-green-500',
    background: 'from-blue-50 to-indigo-100'
  },
  shadows: {
    card: 'shadow-lg shadow-blue-100/50',
    cardHover: 'shadow-xl shadow-blue-200/60',
    button: 'shadow-md shadow-blue-200/40'
  },
  animations: {
    pageTransition: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    cardHover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    modalOpen: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.2 }
    }
  }
};

export default theme;
