// Replacement for Sanity Client to fetch from Spring Boot
const API_BASE = "http://localhost:8080/api";

export async function springFetch(endpoint) {
    try {
        const res = await fetch(`${API_BASE}${endpoint}`, { cache: 'no-store' });
        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        return res.json();
    } catch (error) {
        console.error("Spring API Error:", error);
        return null;
    }
}

// Mimic the GROQ query behavior if possible, or just map specific replacement functions
export const client = {
    fetch: async (query, params) => {
        // This is a naive adapter. We need to replace specific queries manually.
        // But for drop-in replacement, we can inspect the query string.

        console.log("Mock Client Fetch:", query);

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
