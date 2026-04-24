import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

    const toggleLanguage = () => {
        const newLanguage = language === 'en' ? 'gu' : 'en';
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
    };

    // Listen for storage events from other tabs to sync language
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'language') {
                const newLanguage = e.newValue;
                if (newLanguage && (newLanguage === 'en' || newLanguage === 'gu')) {
                    setLanguage(newLanguage);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
