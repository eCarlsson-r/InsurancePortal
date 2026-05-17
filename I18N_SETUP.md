# i18n Setup Documentation

## Overview

This project uses **i18next** and **react-i18next** for internationalization (i18n). The setup supports multiple languages with Indonesian (id) as the default language and English (en) as the fallback.

## Configuration

### Files Structure

```
resources/js/
├── i18n.ts                 # i18n configuration
├── app.tsx                 # Main app entry (imports i18n)
└── lang/
    ├── id.json            # Indonesian translations (221 keys)
    └── en.json            # English translations (221 keys)
```

### Default Settings

- **Default Language**: Indonesian (`id`)
- **Fallback Language**: English (`en`)
- **Translation Files**: JSON format with nested structure
- **Debug Mode**: Enabled in development environment

## Usage in Components

### Basic Usage with useTranslation Hook

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
    const { t } = useTranslation();

    return (
        <div>
            <h1>{t('common.save')}</h1>
            <p>{t('common.email_address')}</p>
        </div>
    );
}
```

### Using Translation with Variables

```tsx
import { useTranslation } from 'react-i18next';

function WelcomeComponent() {
    const { t } = useTranslation();
    const userName = 'John Doe';

    return (
        <div>
            {/* If your translation has {{name}} placeholder */}
            <h1>{t('welcome.greeting', { name: userName })}</h1>
        </div>
    );
}
```

### Accessing Nested Translation Keys

The translation files use nested structure. Access them using dot notation:

```tsx
const { t } = useTranslation();

// For nested keys like: { "common": { "save": "Simpan" } }
t('common.save')           // Returns: "Simpan" (in Indonesian)

// For deeply nested keys
t('dashboard.statistics.total_policies')
```

## Language Switching

### Method 1: Using i18n.changeLanguage()

```tsx
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const switchToEnglish = () => {
        i18n.changeLanguage('en');
    };

    const switchToIndonesian = () => {
        i18n.changeLanguage('id');
    };

    return (
        <div>
            <button onClick={switchToIndonesian}>Bahasa Indonesia</button>
            <button onClick={switchToEnglish}>English</button>
        </div>
    );
}
```

### Method 2: Toggle Between Languages

```tsx
import { useTranslation } from 'react-i18next';

function LanguageToggle() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'id' ? 'en' : 'id';
        i18n.changeLanguage(newLang);
    };

    return (
        <button onClick={toggleLanguage}>
            {i18n.language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
        </button>
    );
}
```

### Getting Current Language

```tsx
import { useTranslation } from 'react-i18next';

function CurrentLanguageDisplay() {
    const { i18n } = useTranslation();

    return (
        <div>
            Current Language: {i18n.language}
        </div>
    );
}
```

## Translation File Structure

The translation files (`id.json` and `en.json`) follow this structure:

```json
{
  "common": {
    "save": "Simpan",
    "update": "Perbarui",
    "add": "Tambah",
    "search": "Cari",
    "cancel": "Batal"
  },
  "dashboard": {
    "title": "Dashboard",
    "statistics": {
      "total_policies": "Total Polis"
    }
  }
}
```

## Advanced Usage

### Using Trans Component for Complex Translations

For translations with HTML or React components:

```tsx
import { Trans } from 'react-i18next';

function ComplexTranslation() {
    return (
        <Trans i18nKey="terms.agreement">
            I agree to the <a href="/terms">terms and conditions</a>
        </Trans>
    );
}
```

### Pluralization

If you need pluralization support, structure your translations like this:

```json
{
  "items": {
    "count_one": "{{count}} item",
    "count_other": "{{count}} items"
  }
}
```

Then use:

```tsx
t('items.count', { count: 1 })  // "1 item"
t('items.count', { count: 5 })  // "5 items"
```

### Formatting Dates and Numbers

```tsx
import { useTranslation } from 'react-i18next';

function FormattedContent() {
    const { t, i18n } = useTranslation();

    const date = new Date();
    const number = 1234567.89;

    return (
        <div>
            <p>{date.toLocaleDateString(i18n.language)}</p>
            <p>{number.toLocaleString(i18n.language)}</p>
        </div>
    );
}
```

## Best Practices

1. **Always use translation keys**: Never hardcode strings in components
2. **Consistent key naming**: Use dot notation for nested keys (e.g., `common.save`)
3. **Organize by feature**: Group related translations together
4. **Keep translations in sync**: Ensure both `id.json` and `en.json` have the same keys
5. **Use meaningful key names**: Make keys descriptive (e.g., `dashboard.statistics.total_policies`)
6. **Test both languages**: Always test your components in both Indonesian and English

## Troubleshooting

### Translation not showing

1. Check if the key exists in both translation files
2. Verify the key path is correct (use dot notation)
3. Check browser console for i18next warnings (debug mode is enabled in development)

### Language not switching

1. Ensure `i18n.changeLanguage()` is called correctly
2. Check if the language code is correct ('id' or 'en')
3. Verify the component re-renders after language change

### Missing translations

- The fallback language (English) will be used if a translation is missing in the current language
- Check browser console for missing translation warnings

## Integration with Inertia.js

The i18n setup is compatible with Inertia.js. The i18n instance is initialized before the Inertia app, so translations are available in all components.

### Passing Language from Backend (Optional)

You can pass the user's preferred language from Laravel:

```php
// In your controller
return Inertia::render('Dashboard', [
    'locale' => app()->getLocale(),
]);
```

Then in your component:

```tsx
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function Dashboard({ locale }: { locale: string }) {
    const { i18n } = useTranslation();

    useEffect(() => {
        if (locale && i18n.language !== locale) {
            i18n.changeLanguage(locale);
        }
    }, [locale, i18n]);

    // ... rest of component
}
```

## Adding New Translations

1. Add the key-value pair to both `resources/js/lang/id.json` and `resources/js/lang/en.json`
2. Use the new key in your component with `t('your.new.key')`
3. Test in both languages

Example:

```json
// id.json
{
  "common": {
    "new_feature": "Fitur Baru"
  }
}

// en.json
{
  "common": {
    "new_feature": "New Feature"
  }
}
```

## Resources

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Best Practices](https://www.i18next.com/principles/best-practices)

## Summary

The i18n infrastructure is now set up and ready to use. Simply import `useTranslation` hook in your components and use the `t()` function to access translations. The system will automatically use Indonesian as the default language with English as fallback.