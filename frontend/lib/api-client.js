// API Configuration with environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Centralized API client for all backend requests
 * Automatically handles authentication headers
 */
class ApiClient {
    constructor(baseURL = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    /**
     * Get authorization headers
     */
    getHeaders(customHeaders = {}) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...customHeaders
        };
    }

    /**
     * Generic fetch wrapper
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: this.getHeaders(options.headers)
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Request failed' }));
                throw new Error(error.error || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error(`API Error [${endpoint}]:`, error);
            }
            throw error;
        }
    }

    /**
     * GET request
     */
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'GET' });
    }

    /**
     * POST request
     */
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * PUT request
     */
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * DELETE request
     */
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    /**
     * Upload file (multipart/form-data)
     */
    async upload(endpoint, formData) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers,
            body: formData
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Upload failed' }));
            throw new Error(error.error || `HTTP ${response.status}`);
        }

        return await response.json();
    }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export base URL for direct usage if needed
export { API_BASE_URL };
