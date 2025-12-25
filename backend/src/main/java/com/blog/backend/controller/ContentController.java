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
}
