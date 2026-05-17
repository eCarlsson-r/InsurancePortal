import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './lang/en.json';
import idTranslations from './lang/id.json';

// Initialize i18next with configuration
i18n
    .use(initReactI18next) // Passes i18n down to react-i18next
    .init({
        resources: {
            en: {
                translation: enTranslations,
            },
            id: {
                translation: idTranslations,
            },
        },
        lng: 'id', // Default language (Indonesian)
        fallbackLng: 'en', // Fallback language if translation is missing
        interpolation: {
            escapeValue: false, // React already escapes values
        },
        // Enable debug mode in development
        debug: import.meta.env.DEV,
        // Namespace configuration
        defaultNS: 'translation',
        ns: ['translation'],
    });

export default i18n;

// Made with Bob
