# PWA Setup Guide - Carlsson Insurance Portal

## Overview
This application has been successfully configured as an offline-first Progressive Web App (PWA) using the standard Vite PWA plugin setup.

## What Was Implemented

### 1. Dependencies Installed
- `vite-plugin-pwa` - Vite plugin for PWA support
- `workbox-window` - Service worker registration library

### 2. Vite Configuration (`vite.config.ts`)
Added VitePWA plugin with the following features:
- **Auto-update registration**: Service worker updates automatically
- **Offline support**: App works offline with cached resources
- **Runtime caching strategies**:
  - Google Fonts: CacheFirst (1 year)
  - Images: CacheFirst (30 days, max 100 entries)
  - API calls: NetworkFirst (5 minutes, 10s timeout)
- **Asset caching**: All JS, CSS, HTML, images, and fonts
- **Development mode**: PWA enabled in dev mode for testing

### 3. Service Worker Registration (`resources/js/app.tsx`)
- Integrated service worker registration using `virtual:pwa-register`
- User notification when new content is available
- Console logging when app is ready to work offline
- Immediate service worker activation

### 4. TypeScript Support (`resources/js/vite-env.d.ts`)
- Added type definitions for Vite PWA virtual modules
- Ensures TypeScript compatibility

### 5. Web App Manifest (`public/manifest.json`)
Enhanced with:
- Proper app description
- Icon purposes (any/maskable)
- Orientation preference
- App categories
- Scope and start URL configuration

### 6. PWA Meta Tags (`resources/views/app.blade.php`)
Added essential meta tags:
- Theme color for browser UI
- Apple mobile web app capabilities
- Mobile web app support
- Manifest link

## Testing the PWA

### Development Testing
1. Run the development server:
   ```bash
   npm run dev
   ```

2. Open the application in your browser

3. Open DevTools > Application > Service Workers to verify registration

### Production Testing
1. Build the application:
   ```bash
   npm run build
   ```

2. Serve the built files (using Laravel):
   ```bash
   php artisan serve
   ```

3. Test PWA features:
   - **Install prompt**: Look for "Install App" in browser menu
   - **Offline mode**: Disconnect network and verify app still works
   - **Cache inspection**: DevTools > Application > Cache Storage
   - **Service Worker**: DevTools > Application > Service Workers

### Lighthouse Audit
Run a Lighthouse audit in Chrome DevTools:
1. Open DevTools > Lighthouse
2. Select "Progressive Web App" category
3. Click "Generate report"
4. Should score high on PWA criteria

## PWA Features

### Offline-First Strategy
- All static assets are cached on first visit
- API responses cached for 5 minutes
- Images cached for 30 days
- Fonts cached for 1 year

### Caching Strategies
1. **CacheFirst**: For static assets (fonts, images)
   - Checks cache first, falls back to network
   - Best for resources that don't change often

2. **NetworkFirst**: For API calls
   - Tries network first with 10s timeout
   - Falls back to cache if network fails
   - Ensures fresh data when online

### Auto-Update
- Service worker checks for updates automatically
- Users prompted to reload when new version available
- Seamless update process

## File Structure
```
├── vite.config.ts              # PWA plugin configuration
├── resources/
│   ├── js/
│   │   ├── app.tsx            # Service worker registration
│   │   └── vite-env.d.ts      # TypeScript definitions
│   └── views/
│       └── app.blade.php      # PWA meta tags
└── public/
    ├── manifest.json          # Web app manifest
    ├── favicon.ico            # App icon
    ├── apple-touch-icon.png   # iOS icon
    ├── logo192.png            # 192x192 icon
    └── logo512.png            # 512x512 icon
```

## Customization

### Adjusting Cache Duration
Edit `vite.config.ts` workbox configuration:
```typescript
expiration: {
    maxEntries: 100,
    maxAgeSeconds: 60 * 60 * 24 * 30 // Adjust time here
}
```

### Changing Caching Strategy
Available strategies:
- `CacheFirst`: Cache first, network fallback
- `NetworkFirst`: Network first, cache fallback
- `StaleWhileRevalidate`: Return cache, update in background
- `NetworkOnly`: Always use network
- `CacheOnly`: Always use cache

### Modifying Manifest
Edit `public/manifest.json` to change:
- App name and description
- Theme colors
- Display mode (standalone, fullscreen, minimal-ui)
- Orientation
- Icons

## Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Partial support (iOS 11.3+)
- Opera: Full support

## Notes
- Service worker only works over HTTPS (or localhost)
- Clear browser cache when testing changes
- Use incognito mode for clean testing
- Check browser console for PWA-related messages

## Troubleshooting

### Service Worker Not Registering
- Ensure HTTPS or localhost
- Check browser console for errors
- Verify `vite-plugin-pwa` is installed
- Clear browser cache and reload

### App Not Working Offline
- Check DevTools > Application > Cache Storage
- Verify service worker is active
- Check network tab with offline mode enabled
- Review workbox configuration

### Icons Not Showing
- Verify icon files exist in public directory
- Check manifest.json paths
- Ensure proper icon sizes (192x192, 512x512)
- Clear browser cache

## Next Steps
1. Test the PWA in production environment
2. Verify offline functionality
3. Test install prompt on mobile devices
4. Monitor service worker updates
5. Consider adding push notifications (optional)
6. Implement background sync (optional)

## Resources
- [Vite PWA Plugin Documentation](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [PWA Best Practices](https://web.dev/pwa-checklist/)