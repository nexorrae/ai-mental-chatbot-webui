// Defines the shape of our environment variables
declare global {
    interface Window {
        _env_?: {
            VITE_API_URL?: string;
        };
    }
}

export const config = {
    // Priority: Runtime (window._env_) > Build-time (import.meta.env) > Default
    apiUrl: window._env_?.VITE_API_URL || import.meta.env.VITE_API_URL || "http://localhost:3000",
};
