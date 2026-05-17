/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
    readonly VITE_APP_NAME: string;
    // Add other env variables here
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// Made with Bob
