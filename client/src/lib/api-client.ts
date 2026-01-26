/**
 * API Client Configuration
 * Handles API base URL configuration for development and production
 */

// Get API URL from environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Fetches data from the API with the configured base URL
 * @param endpoint - API endpoint path (e.g., '/api/students')
 * @param options - Fetch options
 */
export async function apiFetch(endpoint: string, options?: RequestInit): Promise<Response> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include', // Include cookies for sessions
  });
}

/**
 * Returns the full URL for an API endpoint
 * @param endpoint - API endpoint path
 */
export function getApiUrl(endpoint: string): string {
  return endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
}

/**
 * Export the base URL for cases where it's needed directly
 */
export { API_BASE_URL };
