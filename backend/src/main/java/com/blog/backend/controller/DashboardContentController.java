package com.blog.backend.controller;

import com.blog.backend.model.Post;
import com.blog.backend.model.PostStatus;
import com.blog.backend.model.PostRevision;
import com.blog.backend.model.RevisionStatus;
import com.blog.backend.model.User;
import com.blog.backend.model.Role;
import com.blog.backend.repository.PostRepository;
import com.blog.backend.repository.PostRevisionRepository;
import com.blog.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/content")
@CrossOrigin(origins = "*")
public class DashboardContentController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostRevisionRepository postRevisionRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Helper method to get current authenticated user
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Get improvement drafts for current user
     * Shows posts with pending revisions
     */
    @GetMapping("/improvement-drafts")
    public ResponseEntity<?> getMyImprovementDrafts() {
        try {
            User currentUser = getCurrentUser();
            List<PostRevision> revisions = postRevisionRepository.findByCreatedBy(currentUser);

            // Filter to only pending/draft revisions
            List<PostRevision> activeRevisions = revisions.stream()
                    .filter(rev -> rev.getStatus() == RevisionStatus.DRAFT ||
                            rev.getStatus() == RevisionStatus.PENDING_REVIEW)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(activeRevisions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error fetching improvement drafts: " + e.getMessage()));
        }
    }

    /**
     * Get all pending revisions (for Editors and Admins)
     */
    @GetMapping("/pending-revisions")
    public ResponseEntity<?> getPendingRevisions() {
        try {
            User currentUser = getCurrentUser();

            // Check if user is Editor or Admin
            boolean isEditorOrAdmin = currentUser.getRole() == Role.EDITOR ||
                    currentUser.getRole() == Role.ADMIN;

            if (!isEditorOrAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only Editors and Admins can view all pending revisions"));
            }

            List<PostRevision> pendingRevisions = postRevisionRepository
                    .findByStatus(RevisionStatus.PENDING_REVIEW);

            return ResponseEntity.ok(pendingRevisions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error fetching pending revisions: " + e.getMessage()));
        }
    }

    /**
     * Get current user's content with filters
     * Available to all authenticated users
     */
    @GetMapping("/my-content")
    public ResponseEntity<?> getMyContent(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            User currentUser = getCurrentUser();
            Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());

            Page<Post> posts;

            if (status != null && !status.isEmpty()) {
                PostStatus postStatus = PostStatus.valueOf(status.toUpperCase());

                if (search != null && !search.isEmpty()) {
                    posts = postRepository.findByCreatedByAndStatusAndTitleContainingIgnoreCase(
                            currentUser, postStatus, search, pageable);
                } else {
                    posts = postRepository.findByCreatedByAndStatus(currentUser, postStatus, pageable);
                }
            } else {
                if (search != null && !search.isEmpty()) {
                    posts = postRepository.findByCreatedByAndTitleContainingIgnoreCase(
                            currentUser, search, pageable);
                } else {
                    posts = postRepository.findByCreatedBy(currentUser, pageable);
                }
            }

            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error fetching content: " + e.getMessage()));
        }
    }

    /**
     * Get all content (Editor and Admin only)
     * Advanced filtering and search
     */
    @GetMapping("/all-content")
    public ResponseEntity<?> getAllContent(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long authorId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            User currentUser = getCurrentUser();

            // Check if user is Editor or Admin
            boolean isEditorOrAdmin = currentUser.getRole() == Role.EDITOR ||
                    currentUser.getRole() == Role.ADMIN;

            if (!isEditorOrAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only Editors and Admins can view all content"));
            }

            Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());
            Page<Post> posts;

            // Complex filtering logic
            if (status != null && authorId != null && search != null) {
                // All filters
                PostStatus postStatus = PostStatus.valueOf(status.toUpperCase());
                User author = userRepository.findById(authorId)
                        .orElseThrow(() -> new RuntimeException("Author not found"));
                posts = postRepository.findByStatusAndCreatedByAndTitleContainingIgnoreCase(
                        postStatus, author, search, pageable);
            } else if (status != null && authorId != null) {
                // Status + Author
                PostStatus postStatus = PostStatus.valueOf(status.toUpperCase());
                User author = userRepository.findById(authorId)
                        .orElseThrow(() -> new RuntimeException("Author not found"));
                posts = postRepository.findByStatusAndCreatedBy(postStatus, author, pageable);
            } else if (status != null && search != null) {
                // Status + Search
                PostStatus postStatus = PostStatus.valueOf(status.toUpperCase());
                posts = postRepository.findByStatusAndTitleContainingIgnoreCase(
                        postStatus, search, pageable);
            } else if (authorId != null && search != null) {
                // Author + Search
                User author = userRepository.findById(authorId)
                        .orElseThrow(() -> new RuntimeException("Author not found"));
                posts = postRepository.findByCreatedByAndTitleContainingIgnoreCase(
                        author, search, pageable);
            } else if (status != null) {
                // Status only
                PostStatus postStatus = PostStatus.valueOf(status.toUpperCase());
                posts = postRepository.findByStatus(postStatus, pageable);
            } else if (authorId != null) {
                // Author only
                User author = userRepository.findById(authorId)
                        .orElseThrow(() -> new RuntimeException("Author not found"));
                posts = postRepository.findByCreatedBy(author, pageable);
            } else if (search != null && !search.isEmpty()) {
                // Search only
                posts = postRepository.findByTitleContainingIgnoreCase(search, pageable);
            } else {
                // No filters - all posts
                posts = postRepository.findAll(pageable);
            }

            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error fetching all content: " + e.getMessage()));
        }
    }}catch(

    Exception e)
    {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error fetching stats: " + e.getMessage()));
        }
}}
