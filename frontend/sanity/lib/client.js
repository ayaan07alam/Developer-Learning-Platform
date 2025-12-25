// Replaces sanity/lib/client.js

const API_BASE = "http://localhost:8080/api";

async function springFetch(endpoint) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch from Spring');
    return await res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

export const client = {
  fetch: async (query, params) => {
    console.log("Intercepted Query:", query);

    // 1. Get All Posts
    if (query.includes('type == "post"')) {
      const posts = await springFetch('/post');
      return posts.map(p => ({
        title: p.title,
        slug: { current: p.slug },
        smallDescription: p.smallDescription,
        mainImage: p.mainImage, // Frontend components likely handle URL string or Object. We might need to mock Object if it breaks.
        // Mocking Sanity Image Object if needed: 
        // mainImage: { asset: { _ref: '...' }, url: p.mainImage } 
        publishedAt: p.publishedAt,
        author: p.author ? { name: p.author.name, image: p.author.image } : null,
        categories: p.categories ? p.categories.map(c => ({ title: c.title })) : []
      }));
    }

    // 2. Get Single Post
    if (query.includes('slug.current == $slug')) {
      const p = await springFetch(`/post/${params.slug}`);
      if (!p) return null;
      return {
        title: p.title,
        slug: { current: p.slug },
        mainImage: p.mainImage,
        body: p.content ? JSON.parse(p.content) : [], // Parse JSON string back to object
        author: p.author ? {
          name: p.author.name,
          image: p.author.image,
          slug: { current: p.author.slug },
          bio: p.author.bio ? JSON.parse(p.author.bio) : []
        } : null,
        publishedAt: p.publishedAt
      };
    }

    return [];
  }
}
