import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Routes from './Routes';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';



import './styles/index.css';
import './styles/tailwind.css';
import authService from './utils/authService';
import { GoogleAuthProviderContext } from './components/GoogleAuthProviderContext';

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  // Initialize default admin account when the app starts
  // Admin initialization removed to prevent auto-login checks on startup. 
  // Admin account should be seeded via SQL or a dedicated admin setup page if needed.
  useEffect(() => {
    // Check if admin exists and create if not
    // authService.createDefaultAdminIfNotExists();
  }, []);

  // Disable right-click context menu across the entire website
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Add event listener to disable right-click
    document.addEventListener('contextmenu', handleContextMenu);

    // Cleanup: Remove event listener when component unmounts
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <GoogleAuthProviderContext>
      <LanguageProvider>
        <AuthProvider>
          <Routes />
          <Analytics />
          <SpeedInsights />
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'font-sans font-medium',
              style: {
                borderRadius: '8px',
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>

      </LanguageProvider>
    </GoogleAuthProviderContext>
  );
}

export default App;