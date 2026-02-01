// Export the Base URL for API requests
// If VITE_API_BASE_URL is defined (e.g., in .env), use it and strip trailing slashes.
// Otherwise, default to an empty string to use relative paths (handled by Vite proxy).
export const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
