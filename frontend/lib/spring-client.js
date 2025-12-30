// Replacement for Sanity Client to fetch from Spring Boot
import { API_BASE_URL } from './api-client';
const API_BASE = API_BASE_URL;

export async function springFetch(endpoint) {
    try {
        const res = await fetch(`${API_BASE}/api${endpoint}`, { cache: 'no-store' });
        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        return res.json();
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error("Spring API Error:", error);
        }
        return null;
    }
}

// Mimic the GROQ query behavior if possible, or just map specific replacement functions
export const client = {
    fetch: async (query, params) => {
        // This is a naive adapter. We need to replace specific queries manually.
        // But for drop-in replacement, we can inspect the query string.



        if (query.includes('*[_type == "post"]')) {
            return await springFetch('/post');
        }
        if (query.includes('slug.current == $slug')) {
            // Extract slug from params
            // params might be { slug: "some-slug" }
            return await springFetch(`/post/${params.slug}`);
        }

        return [];
    }
}
