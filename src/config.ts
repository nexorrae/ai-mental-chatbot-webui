// Defines the shape of our environment variables
declare global {
    interface Window {
        _env_?: {
            VITE_API_URL?: string;
        };
    }
}

function normalizeBaseUrl(raw?: string): string {
    return (raw ?? '').trim().replace(/\/+$/, '');
}

function buildApiEndpoint(baseUrl: string, path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    if (!baseUrl) {
        return normalizedPath;
    }

    // Support both base host (https://domain.com) and base path (/api)
    // without creating duplicated /api/api/* endpoints.
    if (baseUrl.endsWith('/api') && normalizedPath.startsWith('/api/')) {
        return `${baseUrl}${normalizedPath.slice(4)}`;
    }

    return `${baseUrl}${normalizedPath}`;
}

const apiBaseUrl = normalizeBaseUrl(
    // Priority: Runtime (window._env_) > Build-time (import.meta.env) > Default
    window._env_?.VITE_API_URL || import.meta.env.VITE_API_URL || ''
);

export const config = {
    apiUrl: apiBaseUrl,
    chatEndpoint: buildApiEndpoint(apiBaseUrl, '/api/chat'),
};
