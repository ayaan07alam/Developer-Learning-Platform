// API Helper - Use this constant everywhere instead of hardcoded URLs
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Helper function for authenticated requests
export async function fetchWithAuth(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
    });
}
