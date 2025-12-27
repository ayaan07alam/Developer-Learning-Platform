package com.blog.backend.controller;

import com.blog.backend.model.Post;
import com.blog.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*") // Open for Next.js dev
@RestController
@RequestMapping("/api")
public class ContentController {

    @Autowired
    private PostRepository postRepository;

    @GetMapping("/post") // Functionally 'get all posts'
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    @GetMapping("/post/{slug}") // Functionally 'get post by slug'
    public Post getPostBySlug(@PathVariable String slug) {
        return postRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    @GetMapping("/content/stats") // Dashboard statistics
    public java.util.Map<String, Object> getContentStats() {
        long totalPosts = postRepository.count();
        long publishedPosts = postRepository.findByStatus(com.blog.backend.model.PostStatus.PUBLISHED).size();
        long draftPosts = postRepository.findByStatus(com.blog.backend.model.PostStatus.DRAFT).size();

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalPosts", totalPosts);
        stats.put("publishedPosts", publishedPosts);
        stats.put("draftPosts", draftPosts);
        stats.put("totalViews", 0); // Placeholder - can add actual view counting later

        return stats;
    }
}
