import { useTranslation } from 'react-i18next';

function LanguageToggle() {
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'id' ? 'en' : 'id';
        i18n.changeLanguage(newLang);
    };

    return (
        <button className="btn" onClick={toggleLanguage}>
            {i18n.language === 'id'
                ? t('common.switch_to_english')
                : t('common.switch_to_indonesian')}
        </button>
    );
}

export { LanguageToggle };